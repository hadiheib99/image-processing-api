import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { resizeImage } from "./imgCrop";

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
// Endpoint to crop image and save to thumb folder
//simple url to use:
//http://localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200
app.get("/api/images", async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;

  if (!filename) {
    return res.status(400).json({
      error: "Missing required query parameters: filename",
    });
  }
  if (!width && !height) {
    return res.status(400).json({
      error: "Missing required query parameters:  width, height",
    });
  }
  if (!width) {
    return res.status(400).json({
      error: "Missing required query parameters:  width",
    });
  }
  if (!height) {
    return res.status(400).json({
      error: "Missing required query parameters:  height",
    });
  }

  const inputPath = path.join(
    path.resolve(__dirname, ".."),
    "img",
    filename as string
  );
  const thumbDir = path.join(path.resolve(__dirname, ".."), "thumb");
  const outputFilename = `${path.parse(filename as string).name}_thumb${path.extname(filename as string)}`;
  const outputPath = path.join(thumbDir, outputFilename);

  try {
    // Ensure thumb directory exists
    await fs.promises.mkdir(thumbDir, { recursive: true });

    // Check if input file exists
    await fs.promises.access(inputPath, fs.constants.F_OK);

    await resizeImage({
      inputPath,
      outputFolder: thumbDir,
      width: parseInt(width as string),
      height: parseInt(height as string),
      outputFileName: outputFilename,
    });
    res.status(200).sendFile(outputPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      res.status(404).json({ error: "Input image not found." });
    } else {
      res.status(500).json({
        error: "Image processing failed",
        details: (error as Error).message,
      });
    }
  }
});
// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
export default app;
