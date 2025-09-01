"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import { fileURLToPath } from "url";
const imgCrop_js_1 = require("./imgCrop.js");
const app = (0, express_1.default)();
const port = 3000;
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
// Simple root endpoint
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Image Processing API!");
});
// Example API endpoint
app.get("/api", (req, res) => {
    res.status(200).json({ message: "API is working fine!" });
});
// Endpoint to process and resize image, then save to thumb folder
// Example usage:
// http://localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200
app.get("/api/images", async (req, res) => {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        return res.status(400).json({
            error: "Missing required query parameters: filename, width, height",
        });
    }
    const inputPath = path_1.default.join(path_1.default.resolve(__dirname, ".."), "img", filename);
    const thumbDir = path_1.default.join(path_1.default.resolve(__dirname, ".."), "thumb");
    const outputFilename = `${path_1.default.parse(filename).name}_thumb${path_1.default.extname(filename)}`;
    const outputPath = path_1.default.join(thumbDir, outputFilename);
    try {
        await fs_1.default.promises.mkdir(thumbDir, { recursive: true });
        await fs_1.default.promises.access(inputPath, fs_1.default.constants.F_OK);
        await (0, imgCrop_js_1.resizeImage)({
            inputPath,
            outputFolder: thumbDir,
            width: parseInt(width),
            height: parseInt(height),
            outputFileName: outputFilename,
        });
        res.status(200).sendFile(outputPath);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            res.status(404).json({ error: "Input image not found." });
        }
        else {
            res.status(500).json({
                error: "Image processing failed",
                details: error.message,
            });
        }
    }
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
exports.default = app;
