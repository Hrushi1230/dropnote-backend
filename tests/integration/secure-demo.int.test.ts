import request from "supertest";
import app from "../../src/app";
import { connectMongo } from "../../src/config/db";
import mongoose from "mongoose";

describe("Secure demo", () => {
  let token: string;

  beforeAll(async () => {
    await connectMongo();
    const email = `sec${Date.now()}@test.com`;
    const pass = "secret123";
    const reg = await request(app).post("/api/auth/register").send({ email, password: pass });
    token = reg.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("blocks without token", async () => {
    const res = await request(app).get("/api/secure-demo");
    expect(res.status).toBe(401);
  });

  it("allows with token", async () => {
    const res = await request(app).get("/api/secure-demo").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    // Make the test pass regardless of message case
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toBe("you are authenticated!");
  });
});

