import chalk from "chalk";

export default class Logging {
  public static log = (args: string) => this.info(args);

  public static info = (args: string) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );

  public static warning = (args: string) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [WARN]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );

  public static error = (args: string) =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
}
