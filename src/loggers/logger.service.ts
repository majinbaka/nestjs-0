import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';

const SENSITIVE_DATA = ['password', 'token'];
export class CLogger implements LoggerService {
  private writeMessage(
    message: any,
    logType: string,
    ...optionalParams: any[]
  ) {
    if (typeof message === 'object') {
      for (const key in message) {
        if (SENSITIVE_DATA.includes(key)) {
          message[key] = '********';
        }
      }
    }
    (console as any)[logType](message, optionalParams);

    const current_date = new Date();

    if (
      !fs.existsSync(`./logs/${current_date.toDateString()}.${logType}.log`)
    ) {
      fs.writeFile(
        `./logs/${current_date.toDateString()}.${logType}.log`,
        '',
        (err) => {
          if (err) {
            console.error(err);
          }
        },
      );
    }

    fs.appendFile(
      `./logs/${current_date.toDateString()}.${logType}.log`,
      `${current_date.toTimeString()} - ${message}\n`,
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
  }

  log(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'log', optionalParams);
  }
  fatal(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'error', optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'error', optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'warn', optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'debug', optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'debug', optionalParams);
  }
}
