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
    const res = await request(app).get("/api/images");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameters");
  });

  it("should return 400 if filename is missing", async () => {
    const res = await request(app).get("/api/images?width=200&height=200");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameters");
  });

  it("should return 400 if width is missing", async () => {
    const res = await request(app).get(
      "/api/images?filename=palmtunnel.jpg&height=200"
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameters");
  });

  it("should return 400 if height is missing", async () => {
    const res = await request(app).get(
      "/api/images?filename=palmtunnel.jpg&width=200"
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameters");
  });

  it("should process and return the image if all query params are valid", async () => {
    const res = await request(app).get(
      "/api/images?filename=palmtunnel.jpg&width=200&height=200"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image/);
  });
});
