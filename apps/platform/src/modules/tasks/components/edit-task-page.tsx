import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Button } from "@monorepo/ui/components/button";
import { taskQuery } from "../queries";
import { TaskForm } from "./task-form";

export function EditTaskPage() {
  const { taskId } = useParams({ from: "/_authenticated/tasks/$taskId/edit" });
  const task = useQuery(taskQuery(taskId));

  return (
    <main className="flex flex-1 justify-center p-4">
      {task.isPending ? (
        <p className="text-sm text-muted-foreground">Loading task...</p>
      ) : task.isError ? (
        <div role="alert" className="flex items-center gap-3 text-sm text-destructive">
          <span>{task.error.message}</span>
          <Button variant="outline" size="sm" onClick={() => void task.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <TaskForm task={task.data} />
      )}
    </main>
  );
}
