import sharp from "sharp";
import path from "path";
import fs from "fs";
export async function resizeImage(options) {
  const { inputPath, outputFolder, width, height, outputFileName } = options;
  // Check if input file exists (async)
  try {
    await fs.promises.access(inputPath, fs.constants.F_OK);
  } catch {
    throw new Error(`Input file is missing: ${inputPath}`);
  }
  // Ensure output folder exists (async)
  await fs.promises.mkdir(outputFolder, { recursive: true });
  const ext = path.extname(inputPath);
  const baseName =
    outputFileName || path.basename(inputPath, ext) + `_resized${ext}`;
  const outputPath = path.join(outputFolder, baseName);
  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
}
// Async function to check if an image exists in a folder
export async function imageExistsAsync(folderPath, imageName) {
  const imagePath = path.join(folderPath, imageName);
  try {
    await fs.promises.access(imagePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
