/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { Awaitable, ClientEvents } from 'discord.js';
import { ExtendedClient } from '../structs';

export interface IEvent<T extends keyof ClientEvents = keyof ClientEvents> {
    target: T
    execute: (client: ExtendedClient,
        data: ClientEvents[T]) => Awaitable<void>
};