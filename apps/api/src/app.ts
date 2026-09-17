import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env.js";
import { handleError } from "./lib/errors.js";
import { auth } from "./modules/auth/auth.js";
import { requireSession } from "./modules/auth/require-session.js";
import { taskRoutes } from "./modules/tasks/routes.js";

export const app = new Hono();

app.use("/api/*", cors({ origin: env.PLATFORM_URL, credentials: true }));

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("/api/tasks/*", requireSession);

const routes = app.route("/api/tasks", taskRoutes);

export type AppType = typeof routes;

app.get("/", (c) => c.text("Hello Hono!"));

app.notFound((c) => c.json({ error: { code: "NOT_FOUND", message: "Route not found." } }, 404));

app.onError(handleError);
