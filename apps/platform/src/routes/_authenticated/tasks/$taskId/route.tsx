import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/query-client";
import { taskQuery } from "@/modules/tasks/queries";

export const Route = createFileRoute("/_authenticated/tasks/$taskId")({
  beforeLoad: async ({ params }) => {
    const task = await queryClient.ensureQueryData(taskQuery(params.taskId));

    return { breadcrumb: task.title };
  },
});
