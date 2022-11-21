import { ClientEvents } from "discord.js";
import { Client } from "../";

interface ExecuteOptions<T extends keyof ClientEvents = keyof ClientEvents> {
  client: Client;
  data: ClientEvents[T][0];
}
type ExecuteFunction<T extends keyof ClientEvents = keyof ClientEvents> = (
  options: ExecuteOptions<T>
) => unknown;

export type IEvent<T extends keyof ClientEvents = keyof ClientEvents> = {
  target: T;
  execute: ExecuteFunction<T>;
};

export class Event<T extends keyof ClientEvents = keyof ClientEvents> {
  constructor(data: IEvent<T>) {
    Object.assign(this, data);
  }
}
