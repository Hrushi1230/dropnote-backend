import { hashPassword, verifyPassword } from "../../src/utils/password";

describe("Password utils", () => {
  it("hashes and verifies password", async () => {
    const hash = await hashPassword("secret123");
    const ok = await verifyPassword("secret123", hash);
    const fail = await verifyPassword("wrong", hash);
    expect(ok).toBe(true);
    expect(fail).toBe(false);
  });
});
