import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import { logger } from "./customLogger";
import { getAssetPath } from "./paths";

export const initServer = () => {
  const server = express();
  const port = 7251;
  server.use(cors());

  server.get("/api/memes", (req: Request, res: Response) => {
    var path = getAssetPath("images/memes");
    fs.readdir(path, (err, files) => {
      if (!err) {
        res.send({ memes: files });
      }
    });
  });
  server.use("/static", express.static(getAssetPath("images")));
  try {
    server.listen(port, "localhost", () => {
      //<--- this needs a try catch in case the app is started twice when autoupdating
      logger.info(`Server listening on port ${port}`);
    });
  } catch (err) {
    logger.error(err);
  }
};
