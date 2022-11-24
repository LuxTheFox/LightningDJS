# ICommand
- All the properties in [Command - Data](/Command?id=Data)
- Extends [ChatInputApplicationCommandData](https://discord.js.org/#/docs/discord.js/main/typedef/ApplicationCommandData)

## Properties
- The properties inside ICommand
    > ### Name 
    >
    > **Description:** The name of the command
    >
    > **Optional**: No
    >
    > **Default**: None
    >
    > **Type:** string

    > ### Description 
    >
    > **Description:** The description of the command
    >
    > **Optional**: No
    >
    > **Default**: None
    >
    > **Type:** string

    > ### Usage 
    >
    > **Description:** How you use the command, Example: "/help \<page\>"
    >
    > **Optional**: No
    >
    > **Default**: None
    >
    > **Type:** string

    > ### Category 
    >
    > **Description:** The category you want the command to be in
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** string

    > ### RequiredPermissions 
    >
    > **Description:** A list of all required permission to run the command
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** Array<[PermissionResolvable](https://discord.js.org/#/docs/discord.js/main/typedef/PermissionResolvable)>

    > ### RequiredRoles 
    >
    > **Description:** A list of all required roles to run this command
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** Array<[RoleResolvable](https://discord.js.org/#/docs/discord.js/main/typedef/RoleResolvable)>

    > ### BannedRoles 
    >
    > **Description:** A list of roles which cannot run this command
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** Array<[RoleResolvable](https://discord.js.org/#/docs/discord.js/main/typedef/RoleResolvable)>

    > ### OwnerOnly 
    >
    > **Description:** Whether the command is owner-only
    >
    > **Optional**: Yes
    >
    > **Default**: none
    >
    > **Type:** boolean

    > ### DevOnly 
    >
    > **Description:** Whether the command is developer-only
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** boolean

    > ### nsfw 
    >
    > **Description:** Whether the command is NSFW
    >
    > **Optional**: Yes
    >
    > **Default**: none
    >
    > **Type:** boolean

    > ### Execute    
    >
    > **Description:** The execute function which will be run when the command is ran
    >
    > **Optional**: No
    >
    > **Default**: None
    >
    > **Type:** (options: CommandExecuteOptions) => unknown;