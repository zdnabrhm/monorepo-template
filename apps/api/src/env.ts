import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    PLATFORM_URL: z.url(),
    PORT: z.coerce.number().int().positive().default(8000),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
