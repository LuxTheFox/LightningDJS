import { Client } from ".";
import {
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
  PermissionResolvable,
  RoleResolvable,
  ChatInputApplicationCommandData,
} from "discord.js";

interface ExecuteOptions {
  client: Client;
  interaction: CommandInteraction;
  args: readonly CommandInteractionOption<CacheType>[];
}
type ExecuteFunction = (options: ExecuteOptions) => unknown;

export type ICommand = {
  category?: string;
  usage: string;
  requiredPermissions?: PermissionResolvable[];
  requiredRoles?: RoleResolvable[];
  bannedRoles?: RoleResolvable[];
  ownerOnly?: boolean;
  devOnly?: boolean;
  nsfw?: boolean;

  execute: ExecuteFunction;
} & ChatInputApplicationCommandData;

export class Command {
  constructor(data: ICommand) {
    Object.assign(this, data);
  }
}
