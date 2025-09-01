// src/index.ts
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resizeImage } from "./imgCrop.ts"; // ts-node/esm => .ts extension

// ESM-safe __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
export const app = express();

/**
 * GET /api/images
 * Query: filename (WITH extension, e.g. test.jpg), width, height
 * Returns: resized image (image/*) or 4xx JSON.
 */
app.get("/api/images", async (req, res) => {
  try {
    const filenameRaw = String(req.query.filename ?? "").trim();
    const widthRaw = req.query.width;
    const heightRaw = req.query.height;

    // Missing required keys
    if (!filenameRaw || widthRaw === undefined || heightRaw === undefined) {
      return res.status(400).json({
        error: "Missing required query parameters: filename, width, height",
      });
    }

    const width = Number(widthRaw);
    const height = Number(heightRaw);

    // Bad types or values
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return res
        .status(400)
        .json({ error: "width and height must be numbers" });
    }
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return res
        .status(400)
        .json({ error: "width and height must be positive integers" });
    }

    // Expect filename WITH extension (e.g. test.jpg)
    const filename = filenameRaw;
    const inputPath = path.join(__dirname, "..", "img", filename);

    // 404 early if source missing
    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: "Input image not found." });
    }

    // Ensure output folder and resize
    const ext = path.extname(filename); // .jpg
    const base = path.basename(filename, ext); // test
    const outputFolder = path.join(__dirname, "..", "thumb");
    const outputFileName = `${base}_${width}x${height}${ext}`;

    const outputPath = await resizeImage({
      inputPath,
      outputFolder,
      width,
      height,
      outputFileName,
    });

    // Always use sendFile callback so errors don't hang
    return res.sendFile(outputPath, (err) => {
      if (err) {
        console.error("sendFile error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Image processing failed" });
        }
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Image processing failed" });
  }
});

// Optional root
app.get("/", (_req, res) => {
  res.send("Image Processing API (ESM + TS)");
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

export default app;
