"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe("API Endpoints", () => {
    it("should return welcome message at root", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Welcome to Image Processing API");
    });
    it("should return API working message", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("API is working fine!");
    });
    it("should return 400 for missing crop params", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images");
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Missing required query parameters");
    });
    it("should return 400 if filename is missing", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images?width=200&height=200");
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Missing required query parameters");
    });
    it("should return 400 if width is missing", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images?filename=palmtunnel.jpg&height=200");
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Missing required query parameters");
    });
    it("should return 400 if height is missing", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images?filename=palmtunnel.jpg&width=200");
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Missing required query parameters");
    });
    it("should process and return the image if all query params are valid", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images?filename=palmtunnel.jpg&width=200&height=200");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/image/);
    });
    it("should return 404 and error message if image does not exist", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images?filename=notfound.jpg&width=200&height=200");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Input image not found.");
    });
    it("should return 400 and error message if required query params are missing", async () => {
        const res = await (0, supertest_1.default)(index_1.default).get("/api/images");
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Missing required query parameters");
    });
});
