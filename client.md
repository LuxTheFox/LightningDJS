# Client
- The LightningDJS Client
- Extends [DiscordJS Client](https://discord.js.org/#/docs/discord.js/main/class/Client)

## Properties
- Properties avaliable in `new Client()`
- Extends [DiscordJS ClientOptions](https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions)
    > ### SetupChannelID
    >
    > **Description:** A Channel ID to send an embed to containing the developers, Ping, Channels, Guilds and a nice gif!
    >
    > **Optional**: Yes
    >
    > **Default**: None
    >
    > **Type:** string
    >
    > **Note:** only editable during client creation (`new Client()`)

    > ### DefaultCommands
    >
    > **Description:** Whether you would like to enable any default commands to be loaded
    >
    > **Optional**: During creation
    >
    > **Default**: []
    >
    > **Type:** Array\<[IDefaultCommands](/IDefaultCommands.md)\>
    >
    > **Note:** only editable during client creation (`new Client()`)

    > ### Developers 
    >
    > **Description:** The array used to tell if a user is a bot developer
    >
    > **Optional**: During creation
    >
    > **Default**: []
    >
    > **Type:** Array\<String\>

    > ### Logger 
    >
    > **Description:** The logger used in the internal code
    >
    > **Optional**: During creation
    >
    > **Default**: New Logger(false)
    >
    > **Type:** [Logger](/logger.md)

    > ### Commands 
    >
    > **Description:** All the cached commands also used for command loading
    >
    > **Optional**: No
    >
    > **Default**: abc
    >
    > **Type:** abc

## Methods
- Methods avaliable from `new Client()`
    > ### LoadCommands 
    >
    > **Description:** Load all commands from the supplied directory
    >
    > **Calls Event:** onEventsLoaded -
    >
    > **Returns** 
    > - Success: Promise\<number\>
    > - Error: Promise\<void\>
    >
    > **Arguments**
    > - options - [CommandRegistarOptions](/CommandRegistarOptions.md)

    > ### LoadEvents 
    >
    > **Description:** Load all events from the supplied directory
    >
    > **Returns** 
    > - Success: Promise\<number\>
    > - Error: Promise\<void\>
    >
    > **Arguments**
    > - options - [EventRegistarOptions](/EventRegistarOptions.md)
