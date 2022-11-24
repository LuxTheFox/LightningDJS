import { initiateCommands, CommandRegistarOptions } from "./CommandRegistar";
import { initiateEvents, EventRegistarOptions } from "./EventRegistar";

const Registar = {
  RegisterCommands: initiateCommands,
  RegisterEvents: initiateEvents,
};

export { Registar, CommandRegistarOptions, EventRegistarOptions };
