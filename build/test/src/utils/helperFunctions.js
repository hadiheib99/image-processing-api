"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageExists = imageExists;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function imageExists(folderPath, imageName) {
    const imagePath = path_1.default.join(folderPath, imageName);
    return fs_1.default.existsSync(imagePath);
}
