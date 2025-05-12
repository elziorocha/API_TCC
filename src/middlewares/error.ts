import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  res.json("Middleware de erro acionado");
  return;
};
