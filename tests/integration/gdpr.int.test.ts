import request from "supertest";
import app from "../../src/app";
import { connectMongo } from "../../src/config/db";
import mongoose from "mongoose";

describe("GDPR Delete", () => {
  let token: string;

  beforeAll(async () => {
    await connectMongo();
    const email = `gdpr${Date.now()}@test.com`;
    await request(app).post("/api/auth/register").send({ email, password: "secret123" });
    const login = await request(app).post("/api/auth/login").send({ email, password: "secret123" });
    token = login.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it("rejects offensive content", async () => {
    const bad = await request(app)
      .post("/api/notes/drop")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "this has banda inside" });
    expect(bad.status).toBe(400);
  });

  it("deletes user and all their data", async () => {
    const del = await request(app)
      .delete("/api/gdpr/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.message).toMatch(/deleted/);
  });
});
