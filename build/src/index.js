import express from "express";
import path from "path";
import fs from "fs";
// import { fileURLToPath } from "url";
import { resizeImage } from "./imgCrop.js";
const app = express();
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
  const inputPath = path.join(path.resolve(__dirname, ".."), "img", filename);
  const thumbDir = path.join(path.resolve(__dirname, ".."), "thumb");
  const outputFilename = `${path.parse(filename).name}_thumb${path.extname(filename)}`;
  const outputPath = path.join(thumbDir, outputFilename);
  try {
    await fs.promises.mkdir(thumbDir, { recursive: true });
    await fs.promises.access(inputPath, fs.constants.F_OK);
    await resizeImage({
      inputPath,
      outputFolder: thumbDir,
      width: parseInt(width),
      height: parseInt(height),
      outputFileName: outputFilename,
    });
    res.status(200).sendFile(outputPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Input image not found." });
    } else {
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
export default app;
