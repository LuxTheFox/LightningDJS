import { colors } from "../Enums";

export class logger {
  private debugOption: boolean;
  constructor(debug: boolean) {
    this.debugOption = debug;
  }
  info(message: string) {
    return console.log(`[${colors.FgCyan}INFO${colors.Reset}] - ${message}`);
  }
  debug(message: string) {
    return this.debugOption
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
  custom(phrase: string, color: keyof typeof colors, message: string) {
    return console.log(
      `[${colors[color]}${phrase}${colors.Reset}] - ${message}`
    );
  }
}
