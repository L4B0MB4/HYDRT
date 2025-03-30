import cors from "cors";
import { app, Menu, Tray } from "electron";
import started from "electron-squirrel-startup";
import fs from "fs";
import path from "node:path";
import { logger } from "./customLogger";

import { CronJob } from "cron";
import { updateElectronApp } from "update-electron-app";
import { readOrCreateConfigFile } from "./configFile";
import { showWindow } from "./showWindow";

import express from "express";
const server = express();
const port = 7251;
try {
  const settings = readOrCreateConfigFile();
  logger.info("starting app");
  updateElectronApp(); // additional configuration options available

  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (started) {
    app.quit();
  }

  console.log(process.env.NODE_ENV);

  const getAssetPath = (partialPath: string) => {
    if (process.env.NODE_ENV == "development") {
      return path.join(process.cwd(), partialPath);
    } else {
      return path.join(process.resourcesPath, partialPath);
    }
  };

  server.use(cors());

  server.get("/api/memes", (req: express.Request, res: express.Response) => {
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
  app.whenReady().then(() => {
    const tray = new Tray(getAssetPath("./images/icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      { label: "Zeig mir ein Meme", type: "normal", click: () => showWindow() },
      { type: "separator" },
      {
        label: "Schließen",
        type: "normal",
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.setToolTip("This is my application.");
    tray.setContextMenu(contextMenu);
  });

  setTimeout(() => {
    const job = new CronJob(
      settings.cronSetting,
      function () {
        showWindow();
      },
      null,
      true,
      "Europe/Berlin"
    );
  }, 10000);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  //app.on("ready", createWindow);

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {});
} catch (err) {
  logger.error(err);
}
