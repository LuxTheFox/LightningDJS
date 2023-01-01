/* 
    DO NOT CHANGE, THIS IS CRUTIAL CODE FOR THIS TO RUN AND WORK CORRECTLY.
    ANY EDITS MADE TO THIS FILE MAY BREAK OR MADE THE CODE UNSTABLE.
    THANK YOU.
*/

import { ExtendedClient } from "../structs";
import { IEvent, IEventManager } from "../interfaces";
import path from 'path';
import fs from 'fs';

export class EventManager {
    constructor(client: ExtendedClient, options: IEventManager) {
        this.run(client, options);
    };

    private async run(client: ExtendedClient, data: IEventManager) {
        await this.CacheEvents(client, data.path)
        .then(([a, obj]) => {
            if (a > 0) client.Logger.Success(`Cached ${a} Event${(a > 1)?"s":""}!`);
            if (Object.keys(obj).length > 0) {
                client.Logger.Failure(`Failed Caching Reason${(a > 1)?"s: -":": --"}`);
                for (let i = 0; i < Object.keys(obj).length; i++) {
                    const key = Object.keys(obj)[i];
                    client.Logger.Failure(`${key}: ${obj[key]}`);
                };
                client.Logger.Failure("--------------------------");
            }
        });

        await this.LoadEvents(client);
    };

    private async ValidateCachingEvent(event: IEvent): Promise<[boolean, string]> {
        if (!event) return [false, "No Event"];
        if (!event.target) return [false, 'No Event "Target"']
        if (!event.execute) return [false, 'No Event "Execute"'];

        return [true, ""];
    };

    private async CacheEvents(client: ExtendedClient, data: IEventManager["path"]): Promise<[number, {[x: string]: string}]> {
        let SuccessCount: number = 0;
        let FailureObj: {[x: string]: string} = {};

        const eventPath = (path.isAbsolute(data)) ? data : path.join(process.cwd(), data);
        const topFiles = fs.readdirSync(eventPath);
        for (let i = 0; i < topFiles.length; i++) {
            const file = topFiles[i];
            if (fs.lstatSync(path.join(eventPath, file)).isDirectory()) {
                const [subSuccess, SubFailureObj] = await this.CacheEvents(client, data);
                SuccessCount += subSuccess;
                Object.assign(FailureObj, SubFailureObj)
            } else {
                const event: { default: IEvent } = await import(path.join(eventPath, file));
                const [validation, reason] = await this.ValidateCachingEvent(event.default);
                if (validation) {
                    client.events.set(event.default.target, event.default);
                    SuccessCount += 1;
                } else {
                    FailureObj[event.default.target] = reason;
                };
            }; 
        };

        return [SuccessCount, FailureObj]
    };

    private async LoadEvents(client: ExtendedClient) {
        let LoadedEvents: string[] = [];
        for (let i = 0; i < client.events.size; i++) {
            const event = client.events.at(i);
            if (!event) continue;

            client.on(event.target.toString(), (...data: []) => event.execute(client, [...data])); 
            LoadedEvents.push(event.target.toString());
        };
        // cum
        client.Logger.Success(`Loaded ${LoadedEvents.length} Event${(LoadedEvents.length > 1)?"s":""}!`);
        client.Logger.Success(`Event${(LoadedEvents.length > 1)?"s: ----------------":": -----------------"}`);
        for (let i = 0; i < LoadedEvents.length; i++) {
            const key = LoadedEvents[i];
            if (!key) return;
            client.Logger.Success(key);
        };
        client.Logger.Success("------------------------");

        client.emit('onEventsLoaded', client.events);
        return;
    };
};