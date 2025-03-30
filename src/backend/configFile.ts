import fs from "fs";
import os from "os";
import path from "path";
import { logger } from "./customLogger";
const homedir = os.homedir();
export const readOrCreateConfigFile = () => {
  const cronSetting = "0 10-18/2 * * 1-5";

  let settings = {
    cronSetting,
  };
  try {
    const userFilePath = path.join(homedir, ".hdydrt.config");
    if (fs.existsSync(userFilePath)) {
      let fileSettings = JSON.parse(fs.readFileSync(userFilePath).toString());

      settings = {
        ...settings,
        ...fileSettings,
      };
    }

    fs.writeFileSync(userFilePath, JSON.stringify(settings, null, 3));
  } catch (err) {
    logger.error("error in readOrCreateConfigFile " + err);
  }
  return settings;
};

const memesPath = path.join(homedir, ".hdydrt.memes");
export const readOrCreateSeenMemesFile = () => {
  let seenMemesConfig = {
    seenMemes: [] as string[],
  };
  try {
    if (fs.existsSync(memesPath)) {
      let seenMemesConfigInFile = JSON.parse(
        fs.readFileSync(memesPath).toString()
      );

      seenMemesConfig = {
        seenMemes: [
          ...seenMemesConfig.seenMemes,
          ...seenMemesConfigInFile.seenMemes,
        ],
      };
    }
    fs.writeFileSync(memesPath, JSON.stringify(seenMemesConfig, null, 3));
  } catch (err) {
    logger.error("error in readOrCreateSeenMeme " + err);
  }
  return seenMemesConfig;
};

export const AddSeenMeme = (meme: string) => {
  const seen = readOrCreateSeenMemesFile();
  seen.seenMemes.push(meme);
  fs.writeFileSync(memesPath, JSON.stringify(seen, null, 3));
};
