// spec/index.spec.ts
import request from "supertest";
import app from "../src/index.ts"; // ESM+ts-node: use .ts extension

describe("API Endpoints /api/images", () => {
  it("should process and return the image if all query params are valid", async () => {
    // Use an image that exists in /img (e.g., test.jpg)
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: 120, height: 120 });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image\//);
    // Optionally: expect(res.body.length).toBeGreaterThan(0);  // would require .buffer(true)
  });

  it("should return 404 and message if image does not exist", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "notfound.jpg", width: 120, height: 120 });

    expect(res.status).toBe(404);
    expect(res.body?.error).toBe("Input image not found.");
  });

  it("should return 400 for non-positive width/height", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: 0, height: -1 });

    expect(res.status).toBe(400);
    // Match your app’s current message (adjust if needed)
    expect(res.body?.error).toMatch(/Invalid|width|height/i);
  });
});
