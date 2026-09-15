import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "./lib/auth.js";
import { env } from "./env.js";

const app = new Hono();

app.use(
  "/api/auth/*",
  cors({
    origin: env.PLATFORM_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => c.text("Hello Hono!"));

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
