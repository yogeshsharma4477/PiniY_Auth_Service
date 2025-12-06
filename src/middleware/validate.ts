import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * validate(schema, property?) -> middleware
 * property defaults to "body" but you can pass "query" or "params"
 */
export const validate =
  (schema: ZodTypeAny, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req[property];
      const parsed = schema.parse(input); // throws ZodError if invalid

      // Attach parsed value to request for typed controllers
      // Using Symbol could avoid collisions; using "validated" is simple
      (req as any).validated = (req as any).validated || {};
      (req as any).validated[property] = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "validation_error",
          details: err.message,
        });
      }
      next(err);
    }
  };
