import pino, { DestinationStream, Logger } from "pino";
import { NextFunction, Request, Response, UnknownObject } from "../types";
import { NODE_ENV, LogLevels } from "../types/enums";
import Config from "../config";
import { generateRandomString } from "../lib";

const logTransport =
  Config.nodeEnv === NODE_ENV.PRODUCTION
    ? pino.transport({
        target: "@logtail/pino",
      })
    : pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "UTC:yyyy-mm-dd HH:MM:ss",
        },
      });

export class LogService {
  private static instance: LogService;
  private readonly logger!: Logger;

  constructor(transport: DestinationStream = logTransport) {
    if (LogService.instance) {
      return LogService.instance;
    }

    this.logger = pino(
      {
        name: "Blog API",
        redact: ["password", "body.password", "body.new_password"],
        level:
          Config.nodeEnv === NODE_ENV.TEST ? LogLevels.silent : LogLevels.info,
      },
      transport
    );

    LogService.instance = this;
  }

  info(data: UnknownObject, message?: string): void {
    this.logger.info(data, message);
  }

  error(err: Error, message?: string): void {
    this.logger.error(errorSerializer(err), message);
  }

  fatal(err: Error, message?: string): void {
    this.logger.fatal(err, message);
  }

  request(id: string, data: UnknownObject): void {
    this.logger.info({ id, ...data }, "[API Request]");
  }

  response(id: string, code: number, response: UnknownObject): void {
    this.logger.info({ id, code, ...response }, "[API Response]");
  }
}

const logger = new LogService();

export function logRequestMiddleware() {
  return function (req: Request, res: Response, next: NextFunction) {
    const requestId = generateRandomString();
    req.request_id = requestId;
    res.request_id = requestId;

    logger.request(requestId, {
      route: req.route,
      // url: req.url,
      // body: req.body,
      // query: req.query,
      // params: req.params,
      // headers: req.headers,
    });
    return next();
  };
}

/**
 Error Serializer to log error object
 as error object will not be logged normally
 */
function errorSerializer(err: Error) {
  return {
    stack: err.stack,
    ...err,
  };
}

export default logger;

export * from "./routerLogger";
