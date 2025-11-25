import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "validation_error",
      details: err.flatten(),
    });
  }

  // Prisma known errors
  if (err?.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      error: "database_error",
      code: err.code,
      meta: err.meta,
    });
  }

  // JWT errors
  if (err?.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid_token" });
  }

  if (err?.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token_expired" });
  }

  // Default fallback
  return res.status(500).json({
    error: "internal_server_error",
    message: err.message || "Unexpected error",
  });
};
