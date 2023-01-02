/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ICommand, ICommandManager } from "../interfaces";
import { APIApplicationCommandSubcommandOption, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandType, ChannelType, Collection, CommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { ExtendedClient } from "../structs";
import path from 'path';
import fs from 'fs';

export class CommandManager {
    constructor(client: ExtendedClient, options: ICommandManager) {
        this.run(client, options);
    };
    private async run(client: ExtendedClient, data: ICommandManager) {
        await this.CacheCommands(client, data.path)
            .then(([a, obj]) => {
                if (a > 0) client.Logger.Success(`Cached ${a} Command${(a > 1)?"s":""}!`);
                if (Object.keys(obj).length > 0) {
                    client.Logger.Failure(`Failed Caching Reason${(a > 1)?"s: -":": --"}`);
                    for (let i = 0; i < Object.keys(obj).length; i++) {
                        const key = Object.keys(obj)[i];
                        client.Logger.Failure(`${key}: ${obj[key]}`);
                    };
                    client.Logger.Failure("--------------------------");
                }
            });

        await this.LoadCommands(client, data);

        await this.ManageCommands(client);
        
        return;
    };

    private async ValidateCachingCommand(cmd: ICommand): Promise<[boolean, string]> {
        if (!cmd) return [false, "No Command"];
        
        if (!cmd.category || (cmd.category && typeof cmd.category != "string")) return [false, "No category or category is not a string"];
        if (!cmd.name || (cmd.name && cmd.name != cmd.name.toLowerCase() || typeof cmd.name != "string")) return [false, "No name or name is a not lowercase string"];
        if (!cmd.description || (cmd.description && typeof cmd.description != "string")) return [false, "No description or description is not a string"];
        if (!cmd.usage || (cmd.usage && typeof cmd.usage != "string")) return [false, "No usage or usage is not a string"];
        if (!cmd.execute || (cmd.execute && typeof cmd.execute != "function")) return [false, "No execute or execute is not a function"];

        if (cmd.requiredPermissions && typeof cmd.requiredPermissions != "object") return [false, "Required Permissions is not an object"];
        if (cmd.requiredRoles && typeof cmd.requiredRoles != "string") return [false, "Required Roles is not an object"];
        if (cmd.nsfw && typeof cmd.nsfw != "boolean" ) return [false, "Nsfw is not a boolean"];

        return [true, ""];
    };

    private async CacheCommands(client: ExtendedClient, data: ICommandManager["path"]): Promise<[number, {[x: string]: string}]> {
        let SuccessCount: number = 0;
        let FailureObj: {[x: string]: string} = {};

        let subCommandArr: Collection<string, ICommand> = new Collection();

        const commandPath = (path.isAbsolute(data)) ? data : path.join(process.cwd(), data);
        const topFiles = fs.readdirSync(commandPath);
        for (let i = 0; i < topFiles.length; i++) {
            const file = topFiles[i];
            
            if (!fs.lstatSync(path.join(commandPath, file)).isDirectory()) {
                const cmd: { default: ICommand } = await import(path.join(commandPath, file));
                if (cmd.default.category.toLowerCase() != 'subcommand' || !cmd.default.subcommandParent) {
                    const [validation, reason] = await this.ValidateCachingCommand(cmd.default);
                    if (!validation) {
                        FailureObj[cmd.default.name] = reason;
                        continue;
                    };

                    client.commands.set(cmd.default.name, cmd.default);
                    SuccessCount += 1;
                    continue;
                };

                let subData = subCommandArr.get(cmd.default.subcommandParent.name);
                if (!subData) {
                    subCommandArr.set(cmd.default.subcommandParent.name, 
                        Object.assign(cmd.default.subcommandParent,{ usage: 'Subcommand Parent', execute: ()=>{return;} }) as ICommand);
                        subData = subCommandArr.get(cmd.default.subcommandParent.name) as ICommand;
                };

                if (!subData.options) subData.options = [];
                cmd.default.type = 1;
                subData.options.push(cmd.default as unknown as ApplicationCommandOptionData);
                continue;
            };
            
            const [subSuccess, SubFailureObj] = await this.CacheCommands(client, path.join(data, file));
            SuccessCount += subSuccess;
            Object.assign(FailureObj, SubFailureObj);
        };

        for (let i = 0; i < subCommandArr.size; i++) {
            const subCommand = subCommandArr.at(i);
            if (!subCommand) continue;
            client.commands.set(subCommand.name, subCommand);
        };

        return [SuccessCount, FailureObj]
    };

    private async LoadCommands(client: ExtendedClient, data: ICommandManager) {
        let loadedCommands;
        if (data.devGuild) {
            const guild = await client.guilds.fetch(data.devGuild);
            if (!guild) client.Logger.Error("INVALID_GUILD", `The provided GuildID (${data.devGuild}) is not a valid ID of any guild the bot is in`);
            loadedCommands = await guild.commands.set(client.commands.toJSON());
        } else {
            loadedCommands = await client.application?.commands.set(client.commands.toJSON());
        };

        if (!loadedCommands) return client.Logger.Failure("Faliure Uploading Commands To Discord");
        client.Logger.Success(`Loaded ${loadedCommands.size} Command${(loadedCommands.size > 1)?"s":""}!`);
        client.Logger.Success(`Command${(loadedCommands.size > 1)?"s: ----------------":": -----------------"}`);
        for (let i = 0; i < loadedCommands.size; i++) {
            const key = loadedCommands.at(i)?.name;
            if (!key) return;
            client.Logger.Success(key);
        };
        client.Logger.Success("--------------------------");
        client.emit('onCommandsLoaded')
    };

    private async ValidateCommandUsage(command: ICommand, interaction: CommandInteraction): Promise<[boolean, string]> {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        if (!member) return [false, "No member"];
        const channel = interaction.channel;
        if (!channel || channel.type != ChannelType.GuildText) return [false, "No channel or not GuildText channel"]

        if (command.requiredPermissions 
            && !command.requiredPermissions.every(i => member.permissions.has(i))) 
            return [false, "You are missing permission(s)"];

        if (command.requiredRoles
            && member.roles.cache.hasAll(...command.requiredRoles.toString()))
            return [false, "You are missing role(s)"];
    
        if (command.nsfw && !channel.nsfw) return [false, "This channel is not NSFW"];

        return [true, ""];
    };

    private async ManageCommands(client: ExtendedClient) {
        client.on("interactionCreate", async(interaction) => {
            if (!interaction.isCommand()) return;
            let cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                interaction.reply({
                    embeds: [ new EmbedBuilder({ title: "Command Not Found." })],
                });
                return;
            };

            let sub = false;
            if (cmd.usage.toLowerCase() == 'subcommand parent') {
                cmd = (cmd.options?.find(i => i.name == (interaction.options as CommandInteractionOptionResolver)["_subcommand"])) as unknown as ICommand;
                sub = true;
                if (!cmd) return;
            };

            const [result, reason] = await this.ValidateCommandUsage(cmd, interaction);

            if (!result) {
                interaction.reply({
                    embeds: [ new EmbedBuilder({ title: reason }) ]
                });
                return;
            };
            console.log('test')
            cmd.execute({
                client: client, 
                interaction: interaction,
                args: ((sub) ? interaction.options.data[0]["options"] : interaction.options.data) as readonly CommandInteractionOption[]
            });
        });
    };
};