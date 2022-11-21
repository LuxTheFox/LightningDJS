import { ChannelType, CommandInteraction, EmbedBuilder } from "discord.js";
import { Client, Event } from "..";
import { ICommand } from "../Structs";

export default new Event({
  target: "interactionCreate",
  execute({ client, data }) {
    if (!data.isCommand()) return;
    const command = client.commands.get(data.commandName);
    if (!command) return;

    ValidateUsage(client, data, command).then(
      () => {
        client.logger.custom(
          "COMMANDS",
          "FgMagenta",
          `"${data.user.tag}" used command "${command.name}" in guild "${data.guild?.name}" with output "Succeeded"`
        );
        return command.execute({
          client: client,
          interaction: data,
          args: data.options.data,
        });
      },
      (rej) => {
        client.logger.custom(
          "COMMANDS",
          "FgMagenta",
          `"${data.user.tag}" used command "${command.name}" in guild "${data.guild?.name}" with output "Failure"`
        );
        return data.reply({
          embeds: [new EmbedBuilder({ title: rej })],
        });
      }
    );
  },
});

async function ValidateUsage(
  client: Client,
  interaction: CommandInteraction,
  command: ICommand
): Promise<string> {
  return new Promise((res, rej) => {
    if (command.dmPermission == false && interaction.channel?.isDMBased())
      return rej("You cannot use this command in a DM Based channel");
    if (command.devOnly && !client.Developers.includes(interaction.user.id))
      return rej(
        `You cannot use this as you are not ${
          client.Developers.length > 1
            ? "one of the bot developers"
            : "the bot developer"
        }`
      );
    if (interaction.channel?.type == ChannelType.GuildText)
      if (command.nsfw && !interaction.channel.nsfw)
        return rej("You cannot use this command in a non-nsfw channel");
    if (command.ownerOnly && interaction.guild?.ownerId !== interaction.user.id)
      return rej("You cannot use this as you are not the guild owner");
    interaction.guild?.members
      .fetch(interaction.user.id)
      .then((GuildMember) => {
        if (
          command.requiredPermissions &&
          command.requiredPermissions.every((v) => {
            GuildMember?.permissions.has(v);
          })
        )
          return rej(
            "You are missing at least 1 required permission to use this command"
          );

        if (
          command.requiredRoles &&
          command.requiredRoles.every((v) => {
            GuildMember?.roles.resolve(v) != null;
          })
        )
          return rej(
            "You are missing at least 1 required role to use this command"
          );

        if (
          command.requiredRoles &&
          command.requiredRoles.every((v) => {
            GuildMember?.roles.resolve(v) == null;
          })
        )
          return rej(
            "You cannot use this command because you have at least 1 banned role"
          );
      });

    res("No issues");
  });
}
