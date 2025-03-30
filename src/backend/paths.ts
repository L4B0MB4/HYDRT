import path from "path";

export const getAssetPath = (partialPath: string) => {
  if (process.env.NODE_ENV == "development") {
    return path.join(process.cwd(), partialPath);
  } else {
    return path.join(process.resourcesPath, partialPath);
  }
};
