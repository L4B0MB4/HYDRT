import { CronJob } from "cron";
import { app, BrowserWindow, Menu, Tray } from "electron";
import started from "electron-squirrel-startup";
import path from "node:path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

console.log(process.env.NODE_ENV);

//auto-start
app.setLoginItemSettings({
  path: app.getPath("exe"),
});

let tray = null;
app.whenReady().then(() => {
  tray = new Tray("./icon.png");
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

const job = new CronJob(
  "*/10 * * * * *",
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
);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {});
