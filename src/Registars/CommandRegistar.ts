import { Client, ICommand, IEvent } from "../Structs";
import fs, { PathLike } from "fs";
import path from "path";

let SavedOptions: CommandRegistarOptions;

export interface CommandRegistarOptions {
  CommandPath: PathLike;
  DevGuildID?: string;
}
export async function initiateCommands(
  client: Client,
  defaultCommands: Client["defaultCommands"],
  options: CommandRegistarOptions
) {
  client.logger.debug(`Initiating Commands`);
  await CacheCommands(client, defaultCommands, options.CommandPath);

  client.logger.info(`Registering Commands`);
  await Register(
    client,
    options.DevGuildID ? options.DevGuildID : undefined
  ).then((num) => {
    import(path.join(__dirname, "..", "Handlers", "CommandHandler.js")).then(
      (event: { default: IEvent }) => {
        client.on(event.default.target.toString(), (data) => {
          event.default.execute({
            client: client,
            data: data,
          });
        });
      }
    );

    client.logger.info(
      `Registered ${num}/${client.commands.size} Commands`
    );
    client.emit("onCommandsLoaded", client.commands);
  });
  SavedOptions = options;
  return client.commands.size;
}

async function CacheCommands(
  client: Client,
  defaultCommands: Client["defaultCommands"],
  cmdPath: PathLike
): Promise<Client["commands"]> {
  const defaultCommandsFiles = fs.readdirSync(path.join(__dirname, "..", "Commands")).filter(i => i.endsWith(".js"));
  for (let i = 0; i < defaultCommandsFiles.length; i++) {
    import(path.join(__dirname, "..", "Commands", defaultCommandsFiles[i]))
      .then((i: { default: ICommand }) => {
        if (!Object.keys(defaultCommands).includes(i.default.name)) return;
        const category = defaultCommands[i.default.name as keyof typeof defaultCommands]?.[0];
        const description = defaultCommands[i.default.name as keyof typeof defaultCommands]?.[1]
        if (category) i.default.category = category;
        if (description) i.default.description = description;
        client.commands.set(i.default.name, i.default);
    });
  };

  client.logger.debug(`Reading Commands path`);
  const commandFolders = fs.readdirSync(cmdPath);
  for (let i = 0; i < commandFolders.length; i++) {
    const Folder = commandFolders[i];
    if (fs.lstatSync(path.join(cmdPath.toString(), Folder)).isDirectory())
      await CacheCommands(client, defaultCommands, path.join(cmdPath.toString(), Folder));
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

export async function Reregister(client: Client, DefaultCommands: Client["defaultCommands"]) {
  const app = SavedOptions.DevGuildID
  ? await client.guilds.fetch(SavedOptions.DevGuildID)
  : await client.application?.fetch();

  await CacheCommands(client, DefaultCommands, SavedOptions.CommandPath);
  await Register(client, SavedOptions.DevGuildID);
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