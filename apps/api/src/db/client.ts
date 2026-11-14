import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env.js";
import { relations } from "./relations.js";

const client = postgres(env.DATABASE_URL);

export const db = drizzle({ client, relations });
