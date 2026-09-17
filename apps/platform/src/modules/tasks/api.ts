import type { AppType } from "@monorepo/api/rpc";
import { env } from "@/env";
import { hc } from "hono/client";
import type { InferRequestType } from "hono/client";
import { z } from "zod";
import { taskErrorSchema } from "./schema";
import type { TaskInput, TaskListParams } from "./schema";

const client = hc<AppType>(env.VITE_API_URL, {
  init: { credentials: "include" },
});

export class TaskRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly issues: z.infer<typeof taskErrorSchema>["error"]["issues"],
  ) {
    super(message);
  }
}

async function throwRequestError(response: Response): Promise<never> {
  const body = taskErrorSchema.safeParse(await response.json());
  throw new TaskRequestError(
    body.success ? body.data.error.message : "Request failed.",
    response.status,
    body.success ? body.data.error.issues : undefined,
  );
}

export async function listTasks(params: TaskListParams) {
  const query: InferRequestType<typeof client.api.tasks.$get>["query"] = {
    search: params.search,
    sort: params.sort,
    order: params.order,
    page: String(params.page),
    pageSize: String(params.pageSize),
  };

  if (params.status !== "all") query.status = params.status;

  const response = await client.api.tasks.$get({ query });

  if (response.status !== 200) return throwRequestError(response);

  return response.json();
}

export async function getTask(id: string) {
  const response = await client.api.tasks[":id"].$get({ param: { id } });

  if (response.status !== 200) return throwRequestError(response);

  return response.json();
}

export async function createTask(input: TaskInput) {
  const response = await client.api.tasks.$post({ json: input });

  if (response.status !== 201) return throwRequestError(response);

  return response.json();
}

export async function updateTask(id: string, input: TaskInput) {
  const response = await client.api.tasks[":id"].$patch({ param: { id }, json: input });

  if (response.status !== 200) return throwRequestError(response);

  return response.json();
}

export async function deleteTask(id: string) {
  const response = await client.api.tasks[":id"].$delete({ param: { id } });

  if (response.status !== 204) return throwRequestError(response);
}
