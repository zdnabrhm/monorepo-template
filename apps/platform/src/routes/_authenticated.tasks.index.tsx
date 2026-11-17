import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/modules/tasks/components/tasks-page";

export const Route = createFileRoute("/_authenticated/tasks/")({
  component: TasksPage,
});
