import { colors } from "../Enums";

export class logger {
  public DebugToggle: boolean;
  constructor(DebugToggle: boolean) {
    this.DebugToggle = DebugToggle;
  }
  info(message: string) {
    return console.log(`[${colors.FgCyan}INFO${colors.Reset}] - ${message}`);
  }
  debug(message: string) {
    return this.DebugToggle
      ? console.log(`[${colors.FgMagenta}DEBUG${colors.Reset}] - ${message}`)
      : "";
  }
  success(message: string) {
    return console.log(
      `[${colors.FgGreen}SUCCESS${colors.Reset}] - ${message}`
    );
  }
  warning(message: string) {
    return console.log(
      `[${colors.FgYellow}WARNING${colors.Reset}] - ${message}`
    );
  }
  error(message: string) {
    return console.log(`[${colors.FgRed}ERROR${colors.Reset}] - ${message}`);
  }
  custom(type: string, color: keyof typeof colors, message: string) {
    return console.log(
      `[${colors[color]}${type}${colors.Reset}] - ${message}`
    );
  }
}
