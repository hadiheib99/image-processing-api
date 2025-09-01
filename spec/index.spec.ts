// src/index.ts (ESM-safe)
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resizeImage } from "./imgCrop.spec.ts"; // TypeScript import without extension

// ESM-safe __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

/**
 * GET /api/images
 * Query: filename (no extension), width, height
 * Returns: resized image (image/*) or 404 JSON message
 */
app.get("/api/images", async (req, res) => {
  try {
    const filename = String(req.query.filename ?? "").trim();
    const widthStr = String(req.query.width ?? "").trim();
    const heightStr = String(req.query.height ?? "").trim();

    // Validate basic params
    const width = Number(widthStr);
    const height = Number(heightStr);
    if (
      !filename ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return res.status(400).json({
        error:
          "Invalid query params. Expected filename, width (>0), height (>0).",
      });
    }

    // Resolve input/output paths
    const inputPath = path.join(__dirname, "..", "img", `${filename}.jpg`);
    const outputFolder = path.join(__dirname, "..", "thumb");
    const outputFileName = `${filename}_${width}x${height}.jpg`;

    // 404 when input image doesn't exist
    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: "Input image not found." });
    }

    // Ensure resize and send back the file
    const outputPath = await resizeImage({
      inputPath,
      outputFolder,
      width,
      height,
      outputFileName,
    });

    // Express will infer content-type from extension, but we can hint explicitly
    // res.type(path.extname(outputPath)); // optional
    return res.status(200).sendFile(outputPath);
  } catch (err) {
    // Log for local debugging; return stable 500 for tests
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Optional root
app.get("/", (_req, res) => {
  res.send("Image Processing API (ESM + TS)");
});

// Only start server when you run the app directly, not during tests
if (process.env.NODE_ENV === "dev") {
  const PORT = Number(process.env.PORT ?? 3000);
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}
