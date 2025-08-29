import request from "supertest";
import app from "../../src/app";
import { connectMongo } from "../../src/config/db";
import mongoose from "mongoose";

describe("Auth API", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("registers a new user and returns token", async () => {
    const email = `user${Date.now()}@test.com`;
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret123" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body?.user?.email).toBe(email);
  });

  it("prevents duplicate registration", async () => {
    const email = `dupe${Date.now()}@test.com`;
    await request(app).post("/api/auth/register").send({ email, password: "x" });
    const res2 = await request(app).post("/api/auth/register").send({ email, password: "x" });
    expect(res2.status).toBe(409);
  });

  it("logs in existing user", async () => {
    const email = `login${Date.now()}@test.com`;
    const pass = "secret123";
    await request(app).post("/api/auth/register").send({ email, password: pass });
    const res = await request(app).post("/api/auth/login").send({ email, password: pass });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("rejects invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "no@no.com", password: "bad" });
    expect(res.status).toBe(401);
  });
});
