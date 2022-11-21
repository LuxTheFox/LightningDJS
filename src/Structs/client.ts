import { logger, ICommand } from "./index";
import {
  CommandRegistarOptions,
  EventRegistarOptions,
  Registar,
} from "../Registars";
import {
  Client as DJSClient,
  ClientOptions,
  Collection,
  Partials,
} from "discord.js";
import { IEvent } from "./event";
import path from "path";

interface IClientOptions extends ClientOptions {
  DevGuildID?: string;
  SetupMessageChannel?: string;
  Developers: string[];
  Logger?: logger;
}
export class Client<T extends boolean = boolean> extends DJSClient<T> {
  private DevGuildID: string | undefined;
  private SetupMessageChannel: string | undefined;
  public logger: logger = new logger(false);
  public guildId: string[] = [];
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
    this.SetupMessageChannel = options.SetupMessageChannel;
    this.DevGuildID = options.DevGuildID;
    if (options.Logger) this.logger = options.Logger;
    this.on("ready", () => {
      this.logger.success(`Logged in as: ${this.user?.tag}`);
    });
    Registar.RegisterDefaults(this);
  }

  public async AutoCommands(options: CommandRegistarOptions): Promise<number | void> {
    options.CommandPath = path.join(
      process.cwd(),
      options.CommandPath.toString()
    );
    if (!this.isReady())
      return this.logger.error("Please login before using AutoCommands");
    this.logger.debug("AutoCommands Ran");
    return await Registar.RegisterCommands(this, options);
  }
  public AutoEvents(options: EventRegistarOptions) {
    options.EventPath = path.join(process.cwd(), options.EventPath.toString());
    if (!this.isReady())
      return this.logger.error("Please login before using AutoEvents");
    this.logger.debug("AutoEvents Ran");
    Registar.RegisterEvents(this, options);
  }

  public login(token?: string | undefined): Promise<string> {
    const result = super.login(token);
    return result;
  }
}
