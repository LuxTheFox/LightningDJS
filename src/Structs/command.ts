/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ICommand } from "../interfaces";

export class Command {
    constructor(options: ICommand) {
        Object.assign(this, options);
    };
};