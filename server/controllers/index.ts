import { RequestHandler } from "express";
import { join } from "path";

export const sendReactApp: RequestHandler = (req, res, next) => {
  return res.sendFile(join(__dirname, "..", "..", "build", "index.html"));
};
