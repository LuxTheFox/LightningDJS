import { EmbedBuilder, EmbedData } from "discord.js";

export class EmbedManager {
    private DefaultOptions: EmbedData = {};

    setDefaultOptions(DefaultOptions: EmbedData) {
        this.DefaultOptions = DefaultOptions;
        return this.DefaultOptions;
    };

    Embed(embedData?: EmbedData) {
        const embed = new EmbedBuilder({...this.DefaultOptions, ...embedData});
        return embed;
    };
};