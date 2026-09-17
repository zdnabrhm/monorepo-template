import { z } from "zod";

import { taskStatus } from "../../db/schema/task.js";

const status = z.enum(taskStatus.enumValues);

export const taskIdSchema = z.object({ id: z.uuid() });

export const listTasksQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: status.optional(),
  sort: z.enum(["createdAt", "title", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  status: status.optional(),
});

export const updateTaskBodySchema = createTaskBodySchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "Provide at least one field.",
  });

export type ListTasksQuery = z.output<typeof listTasksQuerySchema>;

export type CreateTaskInput = z.output<typeof createTaskBodySchema>;

export type UpdateTaskInput = z.output<typeof updateTaskBodySchema>;
