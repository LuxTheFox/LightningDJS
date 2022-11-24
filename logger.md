# Logger
- The LightningDJS Logger class

## Properties
- Properties avaliable in `new Logger()`
    > ### DebugToggle 
    >
    > **Description:** Whether to show debug logs (Only use if you are trying to report a bug)
    >
    > **Optional**: No
    >
    > **Default**: false
    >
    > **Type:** boolean

## Methods
- Methods avaliable in `new Logger()`
    > ### Info 
    >
    > **Description:** Logs you message as "Info" and in Cyan
    >
    > **Returns** 
    > - Success: void
    > - Error: void
    >
    > **Arguments**
    > - message: string

    > ### Success 
    >
    > **Description:** Logs you message as "Success" and in Green
    >
    > **Returns** 
    > - Success: void
    > - Error: void
    >
    > **Arguments**
    > - message: string

    > ### Warning 
    >
    > **Description:** Logs you message as "Warning" and in Yellow
    >
    > **Returns** 
    > - Success: void
    > - Error: void
    >
    > **Arguments**
    > - message: string

    > ### Error 
    >
    > **Description:** Logs you message as "Error" and in Red
    >
    > **Returns** 
    > - Success: void
    > - Error: void
    >
    > **Arguments**
    > - message: string

    > ### Custom 
    >
    > **Description:** Logs your message as a custom Type(phrase) and custom color
    >
    > **Returns** 
    > - Success: void
    > - Error: void
    >
    > **Arguments**
    > - Phrase: string,
    > - color: keyof typeof [colors](/colors.md),
    > - message: string

    