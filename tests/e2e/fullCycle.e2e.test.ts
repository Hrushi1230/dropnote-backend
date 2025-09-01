import { test, expect } from "@playwright/test";

test("full DropNote cycle", async ({ request }) => {
  const emailA = `a${Date.now()}@test.com`;
  const emailB = `b${Date.now()}@test.com`;
  const pass = "secret123";

  // Register A
  await request.post("/api/auth/register", {
    data: { email: emailA, password: pass },
  });

  // Register B
  await request.post("/api/auth/register", {
    data: { email: emailB, password: pass },
  });

  // Login A
  const loginA = await request.post("/api/auth/login", {
    data: { email: emailA, password: pass },
  });
  const tokenA = (await loginA.json()).token;

  // Login B
  const loginB = await request.post("/api/auth/login", {
    data: { email: emailB, password: pass },
  });
  const tokenB = (await loginB.json()).token;

  // A drops
  const drop = await request.post("/api/notes/drop", {
    headers: { Authorization: `Bearer ${tokenA}` },
    data: { content: "hello from A" },
  });
  expect(drop.status()).toBe(201);

  // B inbox
  const inbox = await request.get("/api/notes/inbox", {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const note = (await inbox.json()).note;
  expect(note).toBeTruthy();

  // B replies
  const reply = await request.post(`/api/notes/${note.id}/reply`, {
    headers: { Authorization: `Bearer ${tokenB}` },
    data: { content: "got it!" },
  });
  expect(reply.status()).toBe(201);

  // Second reply should fail
  const reply2 = await request.post(`/api/notes/${note.id}/reply`, {
    headers: { Authorization: `Bearer ${tokenB}` },
    data: { content: "again" },
  });
  expect(reply2.status()).toBe(409);
});
