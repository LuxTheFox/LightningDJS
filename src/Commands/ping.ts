import { EmbedBuilder } from "@discordjs/builders";
import { Command } from "../";

export default new Command({
    name: "ping",
    description: "Get the bots ping",
    usage: "/ping",
    execute: ({
        client,
        interaction
    }) => {
        interaction.reply({ embeds: [new EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`The bots ping is: ${client.ws.ping}ms`)
            .setColor(0o00055)
            .setTimestamp()
        ]});
    }
});