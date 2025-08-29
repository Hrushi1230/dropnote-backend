import request from "supertest";
import app from "../src/app";

describe("Health Endpoint", () => {
  it("should return ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
