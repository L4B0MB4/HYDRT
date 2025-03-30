import fs from "fs";
import os from "os";
import path from "path";
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
    console.error(err);
  }
  return settings;
};
