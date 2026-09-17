import { createFileRoute } from "@tanstack/react-router";
import { taskListSearchSchema } from "@/modules/tasks/schema";

export const Route = createFileRoute("/_authenticated/tasks")({
  validateSearch: taskListSearchSchema,
  beforeLoad: () => ({ breadcrumb: "Tasks" }),
});
