import { signJwt, verifyJwt } from "../../src/utils/jwt";

describe("JWT utils", () => {
  it("signs and verifies token", () => {
    const token = signJwt({ id: "123" }, "1h");
    const payload = verifyJwt<{ id: string }>(token);
    expect(payload.id).toBe("123");
  });
});
