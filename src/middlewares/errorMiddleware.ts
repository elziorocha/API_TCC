import { NextFunction, Response, Request } from "express";
import { ApiError } from "../helpers/api-errors";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const statusMessage = error.statusCode
    ? error.message
    : "Internal Server Error";

  res.status(statusCode).json({ message: statusMessage });
  return;
};
