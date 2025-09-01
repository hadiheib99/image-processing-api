"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imgCrop_js_1 = require("../src/imgCrop.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
describe("resizeImage", () => {
    const testImg = path_1.default.join(path_1.default.resolve(__dirname, ".."), "img", "test.jpg");
    const outputFolder = path_1.default.join(path_1.default.resolve(__dirname, ".."), "thumb");
    const outputFileName = "test_resized.jpg";
    afterAll(() => {
        // Clean up the resized image after test
        const outputPath = path_1.default.join(outputFolder, outputFileName);
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
    });
    it("should resize image and save to output folder", async () => {
        const width = 100;
        const height = 100;
        const outputPath = await (0, imgCrop_js_1.resizeImage)({
            inputPath: testImg,
            outputFolder,
            width,
            height,
            outputFileName,
        });
        expect(fs_1.default.existsSync(outputPath)).toBeTrue();
    });
    it("should throw error if image does not exist", async () => {
        const width = 100;
        const height = 100;
        const fakeImg = path_1.default.join(path_1.default.resolve(__dirname, ".."), "img", "notfound.jpg");
        await expectAsync((0, imgCrop_js_1.resizeImage)({
            inputPath: fakeImg,
            outputFolder,
            width,
            height,
            outputFileName: "notfound_resized.jpg",
        })).toBeRejectedWithError(/Input file is missing/);
    });
});
