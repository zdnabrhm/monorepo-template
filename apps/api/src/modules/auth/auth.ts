import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { v7 as uuidv7 } from "uuid";

import { db } from "../../db/client.js";
import * as schema from "../../db/schema/auth.js";
import { env } from "../../env.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  advanced: { database: { generateId: () => uuidv7() } },
  emailAndPassword: { enabled: true },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  trustedOrigins: [env.PLATFORM_URL],
});
