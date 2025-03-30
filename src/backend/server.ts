import cors from "cors";
import { randomInt } from "crypto";
import express, { Request, Response } from "express";
import fs from "fs";
import { AddSeenMeme, readOrCreateSeenMemesFile } from "./configFile";
import { logger } from "./customLogger";
import { getAssetPath } from "./paths";

export const initServer = () => {
  const server = express();
  const port = 7251;
  server.use(cors());

  server.get("/api/memes", (req: Request, res: Response) => {
    const seenMemes = readOrCreateSeenMemesFile();
    var path = getAssetPath("images/memes");
    fs.readdir(path, (err, files) => {
      if (!err) {
        let unseenFiles = files.filter((x) => !seenMemes.seenMemes.includes(x));
        if (unseenFiles.length > 0) {
          res.send({ memes: [unseenFiles[0]] });
          AddSeenMeme(unseenFiles[0]);
        } else {
          const randomIndex = randomInt(unseenFiles.length - 1);
          res.send({ memes: [files[randomIndex]] });
        }
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
