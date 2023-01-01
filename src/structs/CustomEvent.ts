/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ICustomEvent } from "../interfaces";

export class CustomEvent {
    constructor(options: ICustomEvent) {
        Object.assign(this, options);
    };
};