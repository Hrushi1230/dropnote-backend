import { moderateContent } from "../../src/middleware/moderation";
import { Request, Response } from "express";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("Moderation middleware", () => {
  it("rejects bad content", () => {
    const req = { body: { content: "this is badword" } } as Request;
    const res = mockRes();
    const next = jest.fn();
    moderateContent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Content rejected by moderation" });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes clean content", () => {
    const req = { body: { content: "hello" } } as Request;
    const res = mockRes();
    const next = jest.fn();
    moderateContent(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
