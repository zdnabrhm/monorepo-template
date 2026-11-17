import { createFileRoute } from "@tanstack/react-router";
import { NewTaskPage } from "@/modules/tasks/components/new-task-page";

export const Route = createFileRoute("/_authenticated/tasks/new")({
  beforeLoad: () => ({ breadcrumb: "New task" }),
  component: NewTaskPage,
});
