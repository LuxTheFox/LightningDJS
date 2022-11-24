# **⚡LightningDJS**

[![License](https://img.shields.io/badge/License-GPLv3-blue.svg?color=blue&label=License)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/npm/v/lightningdjs?color=blue&label=Version)](https://www.npmjs.com/package/lightningdjs)
[![Downloads](https://img.shields.io/npm/dt/lightningdjs?color=blue&label=Downloads)](https://www.npmjs.com/package/lightningdjs)

## **Description**
⚡LightningDJS handles slash-commands/events for DiscordJS V14 Bots.

**Documentation**: 
#
## **Use**
If you would like to create a Discord.js V14 Discord bot with ease

Or even if you just want to use the utilites from it
#
## **Tests**
Test size: 50 runs of x blank commands

Operations:
  - Calling "Autocommands"
  - Cache all commands
  - - Read all files
  - - Validate command object
  - - - Read all commands properties
  - - - Check them against correct types
  - - Save to a collection
  - Register all commands
  - - Read all commands
  - - Create valid slash command object
  - - Save to a collecton
   
(Note: This test does not include uploading commands to discord since that will change depending on your hosters wifi connection and discords latency)

**Time taken with command amounts**

1 Command:
- Average: 0.0446s
- Smallest: 0.042s
- Largest: 0.057s

10 Commands:
- Average: 0.3765s
- Smallest: 0.360s
- Largest: 0.414s

25 Commands:
- Average: 0,8754s
- Smallest: 0.857s
- Largest: 0.894s

50 Commands: 
- Average: 1.7403s
- Smallest: 1.649s
- Largest: 1.934s

100 Commands:
- Average: 3.3617s
- Smallest: 3.304s
- Largest: 3.791s
#
## **Useful Information**
Uses Discord.js V14

Built on Node v18