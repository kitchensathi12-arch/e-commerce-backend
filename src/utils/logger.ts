import winston, { Logger } from 'winston';

export const winstonLogger = (name: string, level: string = 'info'): Logger => {
  const logger = winston.createLogger({
    level,
    exitOnError: false,
    defaultMeta: { service: name },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, service }) => {
        return `[${timestamp}] [${service}] ${level}: ${message}`;
      })
    ),
    transports: [new winston.transports.Console()]
  });

  return logger;
};
