import { initiateCommands, CommandRegistarOptions } from "./CommandRegistar";
import { initiateEvents, EventRegistarOptions } from "./EventRegistar";
import { RegisterDefaults } from "./DefaultsRegistar";

const Registar = {
  RegisterCommands: initiateCommands,
  RegisterEvents: initiateEvents,
  RegisterDefaults: RegisterDefaults,
};

export { Registar, CommandRegistarOptions, EventRegistarOptions };
