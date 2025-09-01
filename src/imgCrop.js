"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImage = resizeImage;
exports.imageExistsAsync = imageExistsAsync;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function resizeImage(options) {
    const { inputPath, outputFolder, width, height, outputFileName } = options;
    // Check if input file exists (async)
    try {
        await fs_1.default.promises.access(inputPath, fs_1.default.constants.F_OK);
    }
    catch {
        throw new Error(`Input file is missing: ${inputPath}`);
    }
    // Ensure output folder exists (async)
    await fs_1.default.promises.mkdir(outputFolder, { recursive: true });
    const ext = path_1.default.extname(inputPath);
    const baseName = outputFileName || path_1.default.basename(inputPath, ext) + `_resized${ext}`;
    const outputPath = path_1.default.join(outputFolder, baseName);
    await (0, sharp_1.default)(inputPath).resize(width, height).toFile(outputPath);
    return outputPath;
}
// Async function to check if an image exists in a folder
async function imageExistsAsync(folderPath, imageName) {
    const imagePath = path_1.default.join(folderPath, imageName);
    try {
        await fs_1.default.promises.access(imagePath, fs_1.default.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
