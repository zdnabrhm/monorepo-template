import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

import { db } from "../../db/client.js";
import { task } from "../../db/schema/task.js";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./schema.js";

export async function listTasks(userId: string, query: ListTasksQuery) {
  const { search, status, sort, order, page, pageSize } = query;

  const predicate = and(
    eq(task.userId, userId),
    status ? eq(task.status, status) : undefined,
    search ? ilike(task.title, `%${search.replace(/[\\%_]/g, "\\$&")}%`) : undefined,
  );

  const sortColumns = { createdAt: task.createdAt, title: task.title, status: task.status };

  const sortBy = order === "asc" ? asc(sortColumns[sort]) : desc(sortColumns[sort]);

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

  return { items, total: totalRow.value, page, pageSize };
}

export async function getTask(userId: string, id: string) {
  const [item] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, id), eq(task.userId, userId)));

  return item;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const [item] = await db
    .insert(task)
    .values({ ...input, userId })
    .returning();

  return item;
}

export async function updateTask(userId: string, id: string, input: UpdateTaskInput) {
  const [item] = await db
    .update(task)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .returning();

  return item;
}

export async function deleteTask(userId: string, id: string) {
  const [item] = await db
    .delete(task)
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .returning({ id: task.id });

  return !!item;
}
