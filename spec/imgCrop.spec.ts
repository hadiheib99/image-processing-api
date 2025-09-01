import { resizeImage } from "../src/imgCrop.ts"; // using .ts because you're running via ts-node/esm
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM-safe __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("resizeImage", () => {
  const availableImages = [
    "encenadaport.jpg",
    "fjord.jpg",
    "icelandwaterfall.jpg",
    "palmtunnel.jpg",
    "santamonica.jpg",
    "test.jpg",
  ];
  const testImg = path.join(
    path.resolve(__dirname, "..", "img"),
    availableImages[0]
  );
  const outputFolder = path.join(path.resolve(__dirname, "..", "thumb"));
  const outputFileName = "test_resized.jpg";

  afterAll(() => {
    // Clean up the resized image after test
    const outputPath = path.join(outputFolder, outputFileName);
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });

  it("should resize image and save to output folder", async () => {
    const width = 100;
    const height = 100;
    const outputPath = await resizeImage({
      inputPath: testImg,
      outputFolder,
      width,
      height,
      outputFileName,
    });
    expect(fs.existsSync(outputPath)).toBeTrue();
  });

  it("should throw error if image does not exist", async () => {
    const width = 100;
    const height = 100;
    const fakeImg = path.join(
      path.resolve(__dirname, "..", "img"),
      "notfound.jpg"
    );
    await expectAsync(
      resizeImage({
        inputPath: fakeImg,
        outputFolder,
        width,
        height,
        outputFileName: "notfound_resized.jpg",
      })
    ).toBeRejectedWithError(/Input file is missing/);
  });
});
