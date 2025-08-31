import { resizeImage } from "../src/imgCrop";
import fs from "fs";
import path from "path";

describe("resizeImage", () => {
  const testImg = path.join(path.resolve(__dirname, ".."), "img", "test.jpg");
  const outputFolder = path.join(path.resolve(__dirname, ".."), "thumb");
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
});
