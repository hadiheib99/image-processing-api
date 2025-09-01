// src/index.ts
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resizeImage } from "./imgCrop.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Allowed filename pattern: base name (letters/digits/_/-) + one of the allowed extensions
const FILENAME_RE = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i;

// Centralized helper to return consistent 400s
function badRequest(res: express.Response, details: string[]) {
  return res.status(400).json({
    error: "ValidationError",
    message: "Invalid query parameters.",
    details, // array of specific messages
  });
}

app.get("/api/images", async (req, res) => {
  try {
    const filenameRaw = (req.query.filename ?? "").toString().trim();
    const widthRaw = (req.query.width ?? "").toString().trim();
    const heightRaw = (req.query.height ?? "").toString().trim();

    const details: string[] = [];

    // 1) Missing checks
    if (!filenameRaw) details.push("filename is required");
    if (!widthRaw) details.push("width is required");
    if (!heightRaw) details.push("height is required");

    if (details.length) return badRequest(res, details);

    // 2) Filename validation
    if (!FILENAME_RE.test(filenameRaw)) {
      details.push(
        "filename must be a base name with extension .jpg, .jpeg, .png, or .webp (e.g., fjord.jpg); no folders or spaces",
      );
    }

    // 3) Numeric validation (integers > 0, and sanity upper bound to prevent abuse)
    const width = Number(widthRaw);
    const height = Number(heightRaw);

    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      details.push("width and height must be numeric");
    } else {
      if (!Number.isInteger(width) || width <= 0) {
        details.push("width must be a positive integer");
      }
      if (!Number.isInteger(height) || height <= 0) {
        details.push("height must be a positive integer");
      }
      // Optional safety limit (adjust as you like)
      const MAX_DIM = 10000;
      if (width > MAX_DIM || height > MAX_DIM) {
        details.push(`width and height must be ≤ ${MAX_DIM}`);
      }
    }

    if (details.length) return badRequest(res, details);

    // 4) Resolve paths & existence
    const inputPath = path.join(__dirname, "..", "img", filenameRaw);
    if (!fs.existsSync(inputPath)) {
      return res
        .status(404)
        .json({ error: "NotFound", message: "Input image not found." });
    }

    const ext = path.extname(filenameRaw);
    const base = path.basename(filenameRaw, ext);
    const outputFolder = path.join(__dirname, "..", "thumb");
    const outputFileName = `${base}_${width}x${height}${ext}`;

    const outputPath = await resizeImage({
      inputPath,
      outputFolder,
      width,
      height,
      outputFileName,
    });

    return res.sendFile(outputPath, (err) => {
      if (err && !res.headersSent) {
        console.error("sendFile error:", err);
        res.status(500).json({
          error: "ImageProcessingFailed",
          message: "Image processing failed",
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "ImageProcessingFailed",
      message: "Image processing failed",
    });
  }
});

// Optional home
app.get("/", (_req, res) => res.send("Image Processing API (ESM + TS)"));

// Start only outside tests

const PORT: number = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`),
);

export default app;
