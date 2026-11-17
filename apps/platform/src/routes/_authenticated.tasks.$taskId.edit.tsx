import { createFileRoute } from "@tanstack/react-router";
import { EditTaskPage } from "@/modules/tasks/components/edit-task-page";

export const Route = createFileRoute("/_authenticated/tasks/$taskId/edit")({
  beforeLoad: () => ({ breadcrumb: "Edit" }),
  component: EditTaskPage,
});
