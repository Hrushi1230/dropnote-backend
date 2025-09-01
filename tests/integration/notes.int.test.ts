import request from "supertest";
import app from "../../src/app";
import { connectMongo } from "../../src/config/db";
import mongoose from "mongoose";

async function registerAndLogin(email: string, password = "secret123") {
  await request(app).post("/api/auth/register").send({ email, password });
  const login = await request(app).post("/api/auth/login").send({ email, password });
  return login.body.token as string;
}

describe("Notes API", () => {
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    await connectMongo();
    tokenA = await registerAndLogin(`a${Date.now()}@test.com`);
    tokenB = await registerAndLogin(`b${Date.now()}@test.com`);
  });

  afterAll(async () => {
    // drop DB so repeated runs don't accumulate
    await mongoose.connection.dropDatabase();
  });

  it("A drops once; B sees it in inbox; B replies once", async () => {
    // A drops
    const drop = await request(app)
      .post("/api/notes/drop")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ content: "Hello from A" });
    expect([200,201]).toContain(drop.status);
    expect(drop.body).toHaveProperty("noteId");

    // B inbox
    const inbox = await request(app)
      .get("/api/notes/inbox")
      .set("Authorization", `Bearer ${tokenB}`);
    expect(inbox.status).toBe(200);
    expect(inbox.body.note).toBeTruthy();
    const noteId = inbox.body.note.id;
    expect(noteId).toBeTruthy();

    // B replies
    const reply = await request(app)
      .post(`/api/notes/${noteId}/reply`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ content: "Got it!" });
    expect([200,201]).toContain(reply.status);

    // Second reply should fail
    const reply2 = await request(app)
      .post(`/api/notes/${noteId}/reply`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ content: "Again" });
    expect(reply2.status).toBe(409);
  });

  it("A cannot drop twice in one day", async () => {
    const first = await request(app)
      .post("/api/notes/drop")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ content: "Another from A" });

    // first could be 201 if B received earlier; but second must definitely be 429
    await request(app)
      .post("/api/notes/drop")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ content: "Try again" })
      .expect(429);
  });
});
