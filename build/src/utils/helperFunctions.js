import fs from "fs";
import path from "path";
export function imageExists(folderPath, imageName) {
    const imagePath = path.join(folderPath, imageName);
    return fs.existsSync(imagePath);
}
