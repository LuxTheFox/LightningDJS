import { IEvent, Client } from "../Structs";
import fs, { PathLike } from "fs";
import path from "path";

export interface EventRegistarOptions {
  EventPath: string;
}
export async function initiateEvents(
  client: Client,
  options: EventRegistarOptions
) {
  client.logger.debug("Initiating Events");
  await CacheEvents(client, options.EventPath);

  client.logger.info(`Registering Events`);
  Register(client).then((num) => {
    client.logger.info(`Registered ${num}/${client.events.size} Events`);
    client.emit("onEventsLoaded", client.events);
  });
}

async function CacheEvents(
  client: Client,
  EventPath: PathLike
): Promise<Client["events"]> {
  client.logger.debug("Reading Events Path");
  const eventFolders = fs.readdirSync(EventPath);
  for (let i = 0; i < eventFolders.length; i++) {
    const Folder = eventFolders[i];
    if (fs.lstatSync(path.join(EventPath.toString(), Folder)).isDirectory())
      await CacheEvents(client, path.join(EventPath.toString(), Folder));
    else {
      await import(path.join(EventPath.toString(), Folder)).then(
        async (event: { default: IEvent }) => {
          await ValidateEvent(event.default).then(
            () => {
              client.events.set(event.default.target, event.default);
            },
            (rej) => {
              client.logger.error(
                `Rejected event "${event.default.target}" for reason: ${rej}`
              );
            }
          );
        }
      );
    }
  }
  return client.events;
}

async function ValidateEvent(event: IEvent): Promise<string> {
  return new Promise<string>((res, rej) => {
    if (event.target && typeof event.target !== "string")
      rej("Typeof Target Must Be String");
    res("");
  });
}

let RegisteredEvents = 0;
async function Register(client: Client): Promise<number> {
  for (let i = 0; i < client.events.size; i++) {
    const event = client.events.at(i);
    if (!event) continue;
    client.on(event.target.toString(), (data) => {
      event.execute({ client, data });
      return;
    });
    RegisteredEvents = RegisteredEvents + 1;
  }
  return RegisteredEvents;
}
