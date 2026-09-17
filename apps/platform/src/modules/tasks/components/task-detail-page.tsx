import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch, useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@monorepo/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@monorepo/ui/components/alert-dialog";
import { taskListSearchSchema } from "../schema";
import { TaskStatusBadge } from "./task-status-badge";
import { taskKeys, taskQuery } from "../queries";
import { deleteTask } from "../api";
import type { Task } from "../schema";

export function TaskDetailPage() {
  const { taskId } = useParams({ from: "/_authenticated/tasks/$taskId" });
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
        <TaskDetail task={task.data} />
      )}
    </main>
  );
}

function TaskDetail({ task }: { task: Task }) {
  const search = useSearch({ from: "/_authenticated/tasks/$taskId" });
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/tasks/$taskId" });
  const [confirming, setConfirming] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const remove = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      void navigate({ to: "/tasks", search: taskListSearchSchema.parse(search) });
    },
  });

  async function confirmDelete() {
    setDeleteError(undefined);

    try {
      await remove.mutateAsync();
      setConfirming(false);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete task.");
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold break-words">{task.title}</h1>
          <TaskStatusBadge status={task.status} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button
            render={
              <Link
                to="/tasks/$taskId/edit"
                params={{ taskId: task.id }}
                search={taskListSearchSchema.parse(search)}
              />
            }
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setConfirming(true)}>
            Delete
          </Button>
        </div>
      </div>
      <section className="space-y-2" aria-labelledby="task-description-heading">
        <h2 id="task-description-heading" className="text-sm font-medium text-muted-foreground">
          Description
        </h2>
        <p className="text-sm leading-6 whitespace-pre-wrap">
          {task.description || <span className="text-muted-foreground">No description</span>}
        </p>
      </section>
      <dl className="grid gap-4 border-t pt-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <dt className="text-sm font-medium text-muted-foreground">Created</dt>
          <dd className="text-sm">{new Date(task.createdAt).toLocaleString()}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
          <dd className="text-sm">{new Date(task.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>
      <AlertDialog
        open={confirming}
        onOpenChange={(open) => {
          if (!open) {
            setConfirming(false);
            setDeleteError(undefined);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={remove.isPending} onClick={() => void confirmDelete()}>
              {remove.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
