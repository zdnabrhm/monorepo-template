import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monorepo/ui/components/select";
import { tasksQuery } from "../queries";
import { TasksTable } from "./tasks-table";
import type { TaskListParams } from "../schema";

const statusFilters = [
  { label: "All statuses", value: "all" },
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export function TasksPage() {
  const params = useSearch({ from: "/_authenticated/tasks" });
  const navigate = useNavigate({ from: "/tasks" });
  const tasks = useQuery(tasksQuery(params));

  function change(changes: Partial<TaskListParams>) {
    void navigate({ search: (previous) => ({ ...previous, ...changes }) });
  }

  function sort(column: TaskListParams["sort"]) {
    change({
      sort: column,
      order: params.sort === column && params.order === "asc" ? "desc" : "asc",
      page: 1,
    });
  }

  const pageCount = Math.max(1, Math.ceil((tasks.data?.total ?? 0) / params.pageSize));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button render={<Link to="/tasks/new" search={params} />}>New task</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="max-w-xs"
          type="search"
          placeholder="Search tasks"
          aria-label="Search tasks"
          value={params.search}
          onChange={(event) => change({ search: event.target.value, page: 1 })}
        />
        <Select
          items={statusFilters}
          value={params.status}
          onValueChange={(value) => change({ status: value ?? "all", page: 1 })}
        >
          <SelectTrigger aria-label="Filter by status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {tasks.isPending ? (
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      ) : tasks.isError ? (
        <div role="alert" className="flex items-center gap-3 text-sm text-destructive">
          <span>{tasks.error.message}</span>
          <Button variant="outline" size="sm" onClick={() => void tasks.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <TasksTable tasks={tasks.data.items} params={params} onSort={sort} />
          <div className="flex items-center justify-between text-sm">
            <span>{tasks.data.total} tasks</span>
            <div className="flex items-center gap-2">
              <span>
                Page {params.page} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={params.page <= 1}
                onClick={() => change({ page: params.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={params.page >= pageCount}
                onClick={() => change({ page: params.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
