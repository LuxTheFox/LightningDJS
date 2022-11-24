import { logger, ICommand,IEvent } from "../Structs";
import { Registar, EventRegistarOptions, CommandRegistarOptions } from "../Registars";
import {
  ChannelType,
  Client as DJSClient,
  ClientOptions,
  Collection,
  EmbedBuilder,
  Partials,
} from "discord.js";
import path from "path";

interface IDefaultCommands {
  ping?: [string, string?],
  help?: [string, string?]
}

interface IClientOptions extends ClientOptions {
  SetupChannelID?: string;
  Developers: string[];
  Logger?: logger;
  DefaultCommands?: IDefaultCommands
}
export class Client<T extends boolean = boolean> extends DJSClient<T> {
  private defaultCommands: IDefaultCommands = {};
  public logger: logger = new logger(false);
  public Developers: string[] = [];
  public commands: Collection<string, ICommand> = new Collection();
  public events: Collection<string, IEvent> = new Collection();
  constructor(
    options: IClientOptions = {
      intents: 4609,
      Developers: [],
      partials: [Partials.Channel],
    }
  ) {
    if (!options.partials?.includes(Partials.Channel))
      options.partials?.push(Partials.Channel);
    super(options);
    if (options.Logger) this.logger = options.Logger;
    if (options.DefaultCommands) this.defaultCommands = options.DefaultCommands
    this.on("ready", async() => {
      this.logger.success(`Logged in as: ${this.user?.tag}`);
      if (options.SetupChannelID) {
        const setupChannel = await this.channels.fetch(options.SetupChannelID);
        if (setupChannel?.type !== ChannelType.GuildText) return;
        const Developers: string[] = [];
        for (let i = 0; i < options.Developers.length; i++) {
          Developers.push((await this.users.fetch(options.Developers[i])).username);
        };
        setupChannel.send({ embeds: [new EmbedBuilder()
          .setTitle(`${this.user?.username} is now online!`)
          .setColor(0o00055)
          .setImage("https://i.imgur.com/PHhLUYm.gif")
          .addFields([
            {
              name: "Developers",
              value: Developers.toString().replace(/,/g, "\n"),
              inline: true
            }, {
              name: "Information",
              value: `Ping: ${this.ws.ping}\nUsers: ${this.users.cache.size}\nGuilds: ${this.guilds.cache.size}`,
              inline: true
            }
          ])
        ]})
      }
    });
  };

  public async LoadCommands(options: CommandRegistarOptions): Promise<number | void> {
    options.CommandPath = path.join(
      process.cwd(),
      options.CommandPath.toString()
    );
    if (!this.isReady())
      return this.logger.error("Please login before using LoadCommands");
    this.logger.debug("LoadCommands Ran");
    return await Registar.RegisterCommands(this, this.defaultCommands, options);
  };
  public async ReloadCommands(): Promise<number | void> { 
    if (!this.isReady())
      return this.logger.error("Please login before using ReloadCommands");
    this.logger.debug("ReloadCommands Ran");
    return await Registar.ReregisterCommands(this, this.defaultCommands);
  };
  public async LoadEvents(options: EventRegistarOptions): Promise<number | void> {
    options.EventPath = path.join(process.cwd(), options.EventPath.toString());
    if (!this.isReady())
      return this.logger.error("Please login before using LoadEvents");
    this.logger.debug("LoadEvents Ran");
    return await Registar.RegisterEvents(this, options);
  };

  public login(token?: string | undefined): Promise<string> {
    const result = super.login(token);
    return result;
  };
};
