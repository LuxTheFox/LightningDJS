/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { Awaitable } from 'discord.js';
import { ExtendedClient } from '../structs';

export interface ICustomEvent {
    target: string
    execute: (client: ExtendedClient,
        data: any) => Awaitable<void>
};