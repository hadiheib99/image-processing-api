import fs from "fs";
import path from "path";

export function imageExists(folderPath: string, imageName: string): boolean {
  const imagePath = path.join(folderPath, imageName);
  return fs.existsSync(imagePath);
}
