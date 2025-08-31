import request from "supertest";
import app from "../src/index";

describe("API Endpoints", () => {
  it("should return welcome message at root", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Welcome to Image Processing API");
  });

  it("should return API working message", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("API is working fine!");
  });

  it("should return 400 for missing crop params", async () => {
    const res = await request(app).get("/api/crop");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameters");
  });

  // Add more tests for /api/crop with valid image if needed
});
