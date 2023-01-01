/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ChatInputApplicationCommandData, CommandInteraction, PermissionResolvable, RoleResolvable } from 'discord.js';
import { ExtendedClient } from "../structs";

interface ExecuteOptions {
    client: ExtendedClient,
    interaction: CommandInteraction,
    args: CommandInteraction["options"]["data"]
};
type ExecuteFunction = (options: ExecuteOptions) => unknown;

export interface ICommand extends ChatInputApplicationCommandData{
    category: string;
    name: string;
    description: string;
    usage: string;
    subcommandParent?: {
        category: string;
        name: string;
        description: string;
    };
    requiredPermissions?: PermissionResolvable[];
    requiredRoles?: RoleResolvable[];
    nsfw?: boolean,

    execute: ExecuteFunction
};