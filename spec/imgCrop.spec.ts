// src/imgCrop.ts
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type ResizeArgs = {
  inputPath: string;
  outputFolder: string;
  width: number;
  height: number;
  outputFileName: string;
};

export async function resizeImage({
  inputPath,
  outputFolder,
  width,
  height,
  outputFileName,
}: ResizeArgs): Promise<string> {
  if (!fs.existsSync(inputPath)) {
    throw new Error("Input file is missing");
  }

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const outputPath = path.join(outputFolder, outputFileName);
  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
}
