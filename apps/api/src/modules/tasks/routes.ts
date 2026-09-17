import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../../db/client.js";
import { ApiError, validationError } from "../../lib/errors.js";
import type { AuthVariables } from "../auth/require-session.js";
import { task } from "./schema.js";

const status = z.enum(["todo", "in_progress", "done"]);

const taskId = z.object({ id: z.uuid() });

const listQuery = z.object({
  search: z.string().trim().max(200).optional(),
  status: status.optional(),
  sort: z.enum(["createdAt", "title", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

const createTask = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  status: status.optional(),
});

const updateTask = createTask.partial().refine((input) => Object.keys(input).length > 0, {
  message: "Provide at least one field.",
});

export const taskRoutes = new Hono<{ Variables: AuthVariables }>()
  .get("/", zValidator("query", listQuery, validationError), async (c) => {
    const { search, status, sort, order, page, pageSize } = c.req.valid("query");

    const predicate = and(
      eq(task.userId, c.get("userId")),
      status ? eq(task.status, status) : undefined,
      search ? ilike(task.title, `%${search.replace(/[\\%_]/g, "\\$&")}%`) : undefined,
    );

    const sortColumn = { createdAt: task.createdAt, title: task.title, status: task.status }[sort];
    const sortBy = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [items, [totalRow]] = await Promise.all([
      db
        .select()
        .from(task)
        .where(predicate)
        .orderBy(sortBy, desc(task.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ value: count() }).from(task).where(predicate),
    ]);

    return c.json({ items, total: totalRow.value, page, pageSize });
  })
  .get("/:id", zValidator("param", taskId, validationError), async (c) => {
    const { id } = c.req.valid("param");

    const [item] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, id), eq(task.userId, c.get("userId"))));

    if (!item) throw new ApiError(404, "NOT_FOUND", "Task not found.");

    return c.json(item);
  })
  .post("/", zValidator("json", createTask, validationError), async (c) => {
    const [item] = await db
      .insert(task)
      .values({ ...c.req.valid("json"), userId: c.get("userId") })
      .returning();

    return c.json(item, 201);
  })
  .patch(
    "/:id",
    zValidator("param", taskId, validationError),
    zValidator("json", updateTask, validationError),
    async (c) => {
      const { id } = c.req.valid("param");

      const [item] = await db
        .update(task)
        .set({ ...c.req.valid("json"), updatedAt: new Date() })
        .where(and(eq(task.id, id), eq(task.userId, c.get("userId"))))
        .returning();

      if (!item) throw new ApiError(404, "NOT_FOUND", "Task not found.");

      return c.json(item);
    },
  )
  .delete("/:id", zValidator("param", taskId, validationError), async (c) => {
    const { id } = c.req.valid("param");

    const [item] = await db
      .delete(task)
      .where(and(eq(task.id, id), eq(task.userId, c.get("userId"))))
      .returning({ id: task.id });

    if (!item) throw new ApiError(404, "NOT_FOUND", "Task not found.");

    return c.body(null, 204);
  });
