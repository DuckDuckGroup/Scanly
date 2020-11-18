import winston from 'winston';

export enum Levels {
  'error' = 'error',
  'warn' = 'warn',
  'info' = 'info',
  'http' = 'http',
  'verbose' = 'verbose',
  'debug' = 'debug',
  'silly' = 'silly',
}

const format = winston.format.combine(winston.format.colorize(), winston.format.json());

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOGLEVEL || 'warn',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: 'logs/debug.log', level: Levels.debug.toString() }),
  ],
  format,
});

export default function log(level: Levels, message: string) {
  logger.log({
    level: level.toString(),
    message,
  });
}
