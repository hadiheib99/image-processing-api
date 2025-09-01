// spec/index.spec.ts
import request from "supertest";
import { app } from "../src/index.ts"; // named import

describe("API Endpoints /api/images", () => {
  it("should process and return the image if all query params are valid", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: 120, height: 120 });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image\//);
  });

  it("should return 404 and message if image does not exist", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "notfound.jpg", width: 120, height: 120 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("NotFound");
    expect(res.body.message).toBe("Input image not found.");
  });

  it("should return 400 for non-positive width/height", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: 0, height: -1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.message).toBe("Invalid query parameters.");
    expect(res.body.details).toEqual(
      jasmine.arrayContaining([
        "width must be a positive integer",
        "height must be a positive integer",
      ]),
    );
  });
});

describe("API Endpoints /api/images - validation", () => {
  it("400: missing filename/width/height", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "", width: "", height: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.message).toBe("Invalid query parameters.");
    expect(res.body.details).toEqual(
      jasmine.arrayContaining([
        "filename is required",
        "width is required",
        "height is required",
      ]),
    );
  });

  it("400: invalid filename format", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "fjord123", width: 100, height: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details.join(" ")).toMatch(
      /filename.*extension.*jpg|jpeg|png|webp/i,
    );
  });

  it("400: non-numeric width/height (height=a, width=500f)", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: "500f", height: "a" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details.join(" ")).toMatch(/numeric/);
  });

  it("400: non-positive width/height (0 and -1)", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "test.jpg", width: 0, height: -1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details.join(" ")).toMatch(/positive integer/);
  });

  it("404: file not found", async () => {
    const res = await request(app)
      .get("/api/images")
      .query({ filename: "notfound.jpg", width: 120, height: 120 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("NotFound");
    expect(res.body.message).toBe("Input image not found.");
  });
});
