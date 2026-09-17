import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { ApiError, validationError } from "../../lib/errors.js";
import type { AuthVariables } from "../auth/require-session.js";
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskBodySchema,
} from "./schema.js";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./service.js";

export const taskRoutes = new Hono<{ Variables: AuthVariables }>()
  .get("/", zValidator("query", listTasksQuerySchema, validationError), async (c) => {
    const result = await listTasks(c.get("userId"), c.req.valid("query"));

    return c.json(result);
  })
  .get("/:id", zValidator("param", taskIdSchema, validationError), async (c) => {
    const { id } = c.req.valid("param");
    const item = await getTask(c.get("userId"), id);

    if (!item) throw new ApiError(404, "NOT_FOUND", "Task not found.");

    return c.json(item);
  })
  .post("/", zValidator("json", createTaskBodySchema, validationError), async (c) => {
    const item = await createTask(c.get("userId"), c.req.valid("json"));

    return c.json(item, 201);
  })
  .patch(
    "/:id",
    zValidator("param", taskIdSchema, validationError),
    zValidator("json", updateTaskBodySchema, validationError),
    async (c) => {
      const { id } = c.req.valid("param");
      const item = await updateTask(c.get("userId"), id, c.req.valid("json"));

      if (!item) throw new ApiError(404, "NOT_FOUND", "Task not found.");

      return c.json(item);
    },
  )
  .delete("/:id", zValidator("param", taskIdSchema, validationError), async (c) => {
    const { id } = c.req.valid("param");
    const deleted = await deleteTask(c.get("userId"), id);

    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Task not found.");

    return c.body(null, 204);
  });
