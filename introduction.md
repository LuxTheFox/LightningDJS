# Introduction
- Heres a quick introduction!

### Getting Started (JS)

First create a new project and install LightningDJS:
``` 
npm install lightningdjs
yarn add lightningdjs
```

Create an index.js:
```javascript
const LightningDJS = require('lightningdjs');

const client = new LightningDJS.Client({
    intents: 513,
});

client.on('ready', () => {
    client.AutoCommands({
        CommandPath: 'commands',
        DevGuildID: 'YOUR_DEV_GUILD_ID'
    });
});

client.login("YOUR_TOKEN");
```

Now lets create a simple hello command inside the "commands" folder:
```javascript
const { Command } = require("lightningdjs");

module.exports = new Command({
    name: 'hello',
    description: 'Say hello to the bot!',
    usage: '/hello',
    execute: ({
        client,
        interaction,
        args
    }) => {
        interaction.reply({
            content: `Hello ${interaction.user.username}!`
        });
    }
});
```

Now open up a terminal and run:
```
node index.js
```
---
### Getting Started (TS)

First create a new project and install LightningDJS:
``` 
npm install lightningdjs
yarn add lightningdjs
```

Create an index.ts:
```javascript
import * as LightningDJS from "lightningdjs";

const client = new LightningDJS.Client({
    intents: 513
});

client.on('ready', () => {
    client.LoadCommands({
        CommandPath: 'commands',
        DevGuildID: 'YOUR_GUILD_ID'
    });
});

client.login("YOUR_TOKEN");
```

Now lets create a simple hello command inside the "commands" folder:
```javascript
import { Command } from "lightningdjs";

export default new Command({
    name: 'hello',
    description: 'Say hello to the bot!',
    usage: '/hello',
    execute: ({
        client,
        interaction,
        args
    }) => {
        interaction.reply({
            content: `Hello ${interaction.user.username}!`
        });
    }
});
```

Now open up a terminal and run:
```
node index.js
```