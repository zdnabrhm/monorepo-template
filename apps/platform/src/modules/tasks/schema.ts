import { z } from "zod";
import type { getTask } from "./api";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const taskFilterSchema = z.enum(["all", "todo", "in_progress", "done"]);

export const taskErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    issues: z
      .array(z.object({ path: z.array(z.union([z.string(), z.number()])), message: z.string() }))
      .optional(),
  }),
});

export const taskListSearchSchema = z.object({
  search: z.string().catch(""),
  status: z.enum(["all", "todo", "in_progress", "done"]).catch("all"),
  sort: z.enum(["createdAt", "title", "status"]).catch("createdAt"),
  order: z.enum(["asc", "desc"]).catch("desc"),
  page: z.coerce.number().int().positive().catch(1),
  pageSize: z.coerce.number().int().min(1).max(100).catch(10),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type Task = Awaited<ReturnType<typeof getTask>>;

export type TaskInput = {
  title: string;
  description?: string;
  status: TaskStatus;
};

export type TaskListParams = z.infer<typeof taskListSearchSchema>;

export const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const;
