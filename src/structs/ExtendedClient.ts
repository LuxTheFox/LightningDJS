/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { Client, Collection } from "discord.js";
import { ICommand, ICommandManager, IEvent, IEventManager, IExtendedClient } from "../interfaces";
import { EventManager } from "../managers/EventManager";
import { EmbedManager } from "./embedManager";
import { CommandManager } from "../managers";
import CLIColour from 'cli-color';

export class ExtendedClient<T extends boolean = boolean> extends Client<T> {
    
    private ready: boolean = false;
    commands: Collection<string, ICommand> = new Collection();
    events: Collection<string, IEvent> = new Collection();
    EmbedManager = new EmbedManager();
    Logger = new class logger {
        Success(message: string) {
            console.log(CLIColour.green("[✔] ") + message);
        };
        Failure(message: string) {
            console.log(CLIColour.red("[✖] ") + message);
        };
        Error(title: string, message: string) {
            throw new Error(CLIColour.red("[⚠] " + title + ": ") + message)
        }
    };

    constructor(options: IExtendedClient) {
        super(options);
    };

    public CommandManager(options: ICommandManager): CommandManager {
        if (this.ready == false) this.Logger.Error("Not Ready", 'Please run "CommandManager" AFTER you have logged in')
        return new CommandManager(this, options); 
    };

    public EventManager(options: IEventManager): EventManager {
        if (this.ready == false) this.Logger.Error("Not Ready", 'Please run "EventManager" AFTER you have logged in')
        return new EventManager(this, options); 
    };

    public async login(token: string): Promise<string> {
        return await super.login(token)
            .then((result) => {
                this.ready = true;
                this.Logger.Success("Logged in as " + this.user?.tag)
                return result;
            });
    };
};