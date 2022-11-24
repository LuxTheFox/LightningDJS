import { initiateCommands, Reregister ,CommandRegistarOptions } from "./CommandRegistar";
import { initiateEvents, EventRegistarOptions } from "./EventRegistar";

const Registar = {
  RegisterCommands: initiateCommands,
  ReregisterCommands: Reregister,
  RegisterEvents: initiateEvents,
};

export { Registar, CommandRegistarOptions, EventRegistarOptions };
