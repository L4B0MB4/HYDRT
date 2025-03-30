import os from "os";
import path from "path";
const homedir = os.homedir();

import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: path.join(homedir, ".hydrtlogs/hydrt.log"),
    }),
  ],
});
