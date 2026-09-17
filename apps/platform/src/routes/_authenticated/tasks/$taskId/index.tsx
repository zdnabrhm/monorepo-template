import { createFileRoute } from "@tanstack/react-router";
import { TaskDetailPage } from "@/modules/tasks/components/task-detail-page";

export const Route = createFileRoute("/_authenticated/tasks/$taskId/")({
  component: TaskDetailPage,
});
