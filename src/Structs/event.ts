/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ClientEvents } from "discord.js";
import { IEvent } from "../interfaces";

export class Event<T extends keyof ClientEvents = keyof ClientEvents> {
    constructor(options: IEvent<T>) {
        Object.assign(this, options);
    };
};