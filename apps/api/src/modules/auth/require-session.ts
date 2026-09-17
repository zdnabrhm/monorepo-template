import { createMiddleware } from "hono/factory";

import { ApiError } from "../../lib/errors.js";
import { auth } from "./auth.js";

export type AuthVariables = { userId: string };

export const requireSession = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) throw new ApiError(401, "UNAUTHORIZED", "Sign in to continue.");

  c.set("userId", session.user.id);
  await next();
});
