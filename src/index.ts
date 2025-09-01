import express, { Request, Response } from "express";

import fs from "fs";
// import { fileURLToPath } from "url";
import { resizeImage } from "./imgCrop.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
// Simple root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Image Processing API!");
});

// Example API endpoint
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working fine!" });
});
// Endpoint to process and resize image, then save to thumb folder
// Example usage:
// http://localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200
app.get("/api/images", async (req, res) => {
  try {
    const filename = String(req.query.filename ?? "").trim();
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    // Missing required params
    if (
      !filename ||
      req.query.width === undefined ||
      req.query.height === undefined
    ) {
      return res.status(400).json({
        error: "Missing required query parameters: filename, width, height",
      });
    }

    // Not numbers
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return res
        .status(400)
        .json({ error: "width and height must be numbers" });
    }

    // Non-positive or non-integer (choose your rule; here we enforce positive integers)
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

    // ... keep the rest of your logic (resolve paths, exists check, resize, sendFile) ...
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Image processing failed" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
export default app;
