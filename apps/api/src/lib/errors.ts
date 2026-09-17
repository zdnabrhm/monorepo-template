import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";

export class ApiError extends HTTPException {
  constructor(
    status: ContentfulStatusCode,
    readonly code: string,
    message: string,
  ) {
    super(status, { message });
  }
}

export function validationError(
  result: { success: boolean; error?: z.core.$ZodError },
  c: Context,
) {
  if (result.success) return;

  return c.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the submitted fields.",
        issues:
          result.error?.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message,
          })) ?? [],
      },
    },
    400,
  );
}

export function handleError(error: Error, c: Context) {
  if (error instanceof ApiError) {
    return c.json({ error: { code: error.code, message: error.message } }, error.status);
  }

  if (error instanceof HTTPException) {
    return c.json({ error: { code: "HTTP_ERROR", message: error.message } }, error.status);
  }

  console.error(error);

  return c.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error." } }, 500);
}
