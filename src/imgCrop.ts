import sharp from "sharp";
import path from "path";
import fs from "fs";

interface ResizeOptions {
  inputPath: string;
  outputFolder: string;
  width: number;
  height: number;
  outputFileName?: string;
}

export async function resizeImage(options: ResizeOptions): Promise<string> {
  const { inputPath, outputFolder, width, height, outputFileName } = options;

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const ext = path.extname(inputPath);
  const baseName =
    outputFileName || path.basename(inputPath, ext) + `_resized${ext}`;
  const outputPath = path.join(outputFolder, baseName);

  await sharp(inputPath).resize(width, height).toFile(outputPath);

  return outputPath;
}
