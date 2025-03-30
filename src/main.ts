import { app } from "electron";
import started from "electron-squirrel-startup";
import { updateElectronApp } from "update-electron-app";
updateElectronApp(); // additional configuration options available

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

import { CronJob } from "cron";
import { readOrCreateConfigFile } from "./backend/configFile";
import { logger } from "./backend/customLogger";

import { showAppTray } from "./backend/appTray";
import { showNotification } from "./backend/notification";
import { initServer } from "./backend/server";

try {
  const settings = readOrCreateConfigFile();
  logger.info("starting app");

  logger.info(process.env.NODE_ENV);

  initServer();

  app.whenReady().then(() => {
    showAppTray(app);
  });
  app.setAppUserModelId("com.hyrdt.me");

  const job = new CronJob(
    settings.cronSetting,
    function () {
      showNotification();
    },
    null,
    true,
    "Europe/Berlin"
  );

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {});
} catch (err) {
  logger.error(err);
}
