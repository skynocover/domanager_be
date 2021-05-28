import chalk from 'chalk';
const log = console.log;

export const colorlog = (message: string, color = 'black') => {
  switch (color) {
    case 'success':
      log(chalk.greenBright(message));
      break;
    case 'info':
      log(chalk.cyanBright(message));
      break;
    case 'error':
      log(chalk.redBright(message));
      break;
    case 'warning':
      log(chalk.yellow(message));
      break;
    case 'debug':
      log(chalk.dim(message));
      break;
    default:
      log(message);
  }
};

export const levellog = (message: string, level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
  switch (level) {
    case 7:
      log(chalk.magentaBright(message));
      break;
    case 6:
      log(chalk.dim(message));
      break;
    case 5 | 4:
      log(chalk.yellow(message));
      break;
    default:
      log(chalk.redBright(message));
      break;
  }
};
