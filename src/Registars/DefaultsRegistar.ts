import { Client, IEvent } from "../Structs";
import path from "path";
import fs from "fs";

export async function RegisterDefaults(client: Client) {
  const defaultPath = path.join(__dirname, "..", "Handlers");
  fs.readdirSync(defaultPath).forEach(async (Folder) => {
    await import(path.join(defaultPath, Folder)).then(
      (defaultThing: { default: IEvent }) => {
        client.on(defaultThing.default.target.toString(), (data) => {
          defaultThing.default.execute({
            client: client,
            data: data,
          });
        });
      }
    );
  });
}
