import { Notification } from "electron";
import { showWindow } from "../showWindow";

export const showNotification = () => {
  const notification = new Notification({
    title: "Hey, hast du was getrunken ? 💧",
    body: "Dann klick hier für ein Meme als Belohnung",
    silent: true,
    timeoutType: "never",
    urgency: "critical",
  });

  notification.show();

  notification.on("click", () => {
    showWindow();
  });
  console.log("check if autoupdate works :)");
};
