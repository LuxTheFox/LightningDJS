import { Client } from "..";
import fs, { PathLike } from "fs";
import path from "path";
import { ICommand } from "../Structs";

export interface CommandRegistarOptions {
  CommandPath: PathLike;
  DevGuildID?: string;
}
export async function initiateCommands(
  client: Client,
  options: CommandRegistarOptions
) {
  client.logger.debug(`Initiating Commands`);
  await CacheCommands(client, options.CommandPath);

  client.logger.info(`Registering Commands`);
  await Register(
    client,
    options.DevGuildID ? options.DevGuildID : undefined
  ).then((num) => {
    client.logger.info(
      `Registered ${num}/${client.commands.size} Commands`
    );
    client.emit("onCommandsLoaded", client.commands);
  });
  return client.commands.size;
}

async function CacheCommands(
  client: Client,
  cmdPath: PathLike
): Promise<Client["commands"]> {
  client.logger.debug(`Reading Commands path`);
  const commandFolders = fs.readdirSync(cmdPath);
  for (let i = 0; i < commandFolders.length; i++) {
    const Folder = commandFolders[i];
    if (fs.lstatSync(path.join(cmdPath.toString(), Folder)).isDirectory())
      await CacheCommands(client, path.join(cmdPath.toString(), Folder));
    else
      await import(path.join(cmdPath.toString(), Folder)).then(
        async (command: { default: ICommand }) => {
          await ValidateCommand(command.default).then(
            () => {
              client.commands.set(command.default.name, command.default);
            },
            (rej) => {
              client.logger.error(
                `Rejected Command "${command.default.name}" with reason: ${rej}`
              );
            }
          );
        }
      );
  };
  return client.commands;
};

async function ValidateCommand(command: ICommand): Promise<string> {
  return new Promise<string>((res, rej) => {
    if (command.nsfw && typeof command.nsfw !== "boolean")
      rej("Typeof NSFW Must Be Boolean");
    if (command.usage && typeof command.usage !== "string")
      rej("Typeof Usage Must Be String");
    if (command.category && typeof command.category !== "string")
      rej("Typeof Category Must Be String");
    if (
      command.requiredPermissions &&
      typeof command.requiredPermissions !== "object"
    )
      rej("Typeof RequiredPermissions Must Be PermissionResolvable[]");
    if (command.requiredRoles && typeof command.requiredRoles !== "object")
      rej("Typeof RequiredRoles Must Be RoleResolvable[]");
    if (command.ownerOnly && typeof command.ownerOnly !== "boolean")
      rej("Typeof ownerOnly Must Be Boolean");
    if (command.devOnly && typeof command.devOnly !== "boolean")
      rej("Typeof devOnly Must Be Boolean");

    res("");
  });
};

async function Register(client: Client, DevGuild?: string): Promise<number> {
  const app = DevGuild
    ? await client.guilds.fetch(DevGuild)
    : await client.application?.fetch();

  const commandsData = [];
  for (let i = 0; i < client.commands.size; i++) {
    const command = client.commands.at(i);
    if (!command) continue;
    commandsData.push({
      name: command.name,
      type: command.type,
      options: command.options,
      description: command.description ?? "",
      dmPermission: command.dmPermission ?? true,
    });
    client.logger.debug("Loaded command: " + command.name);
  }
  await app?.commands.set(commandsData);
  client.logger.debug("Set all commands");
  return commandsData.length;
};