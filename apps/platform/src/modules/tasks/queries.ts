import { queryOptions } from "@tanstack/react-query";
import { getTask, listTasks } from "./api";
import type { TaskListParams } from "./schema";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (params: TaskListParams) => ["tasks", params] as const,
  detail: (id: string) => ["tasks", id] as const,
};

export function tasksQuery(params: TaskListParams) {
  return queryOptions({ queryKey: taskKeys.list(params), queryFn: () => listTasks(params) });
}

export function taskQuery(id: string) {
  return queryOptions({ queryKey: taskKeys.detail(id), queryFn: () => getTask(id) });
}
