import { App, Menu, Tray } from "electron";
import { showWindow } from "../showWindow";
import { getAssetPath } from "./paths";

export const showAppTray = (app: App) => {
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
};
