import winston from 'winston';

const format = winston.format.combine(winston.format.colorize(), winston.format.json());

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  format,
});

export default function log(level: string, message: string) {
  logger.log({
    level,
    message,
  });
}
