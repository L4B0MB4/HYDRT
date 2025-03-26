import cors from "cors";
import { app, BrowserWindow, Menu, Tray } from "electron";
import started from "electron-squirrel-startup";
import fs from "fs";
import path from "node:path";

import express from "express";
const server = express();
const port = 7251;

import { updateElectronApp } from "update-electron-app";
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

server.listen(port, "localhost", () => {
  console.log(`Server listening on port ${port}`);
});

app.whenReady().then(() => {
  const tray = new Tray(getAssetPath("./images/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
    { type: "separator" },
    { label: "Zeig mir ein Meme", type: "normal", click: () => createWindow() },
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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

/* const job = new CronJob(
  "0 * * * * *",
  function () {
    job.stop();
    var secondsRandomize = (Math.random() * 100) % 20;
    setTimeout(() => {
      job.start();
      createWindow();
      console.log(
        "You will see this message whenever " + new Date().toISOString()
      );
    }, secondsRandomize * 1000);
  },
  null,
  true,
  "Europe/Berlin"
); */

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {});
