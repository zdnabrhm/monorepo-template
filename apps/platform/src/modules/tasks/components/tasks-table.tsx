import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@monorepo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@monorepo/ui/components/table";
import type { Task, TaskListParams } from "../schema";
import { TaskStatusBadge } from "./task-status-badge";

const features = tableFeatures({});

const helper = createColumnHelper<typeof features, Task>();

type Props = {
  tasks: Task[];
  params: TaskListParams;
  onSort: (sort: TaskListParams["sort"]) => void;
};

export function TasksTable({ tasks, params, onSort }: Props) {
  const columns = helper.columns([
    helper.accessor("title", {
      header: () => <SortButton name="Title" column="title" params={params} onSort={onSort} />,
      // Stretched link: covers the whole row so the row acts as a link while
      // staying an anchor (middle-click, Cmd+click).
      cell: ({ row }) => (
        <Link
          to="/tasks/$taskId"
          params={{ taskId: row.original.id }}
          search={params}
          className="block truncate font-medium after:absolute after:inset-0 focus-visible:outline-2"
        >
          {row.original.title}
        </Link>
      ),
    }),
    helper.accessor("status", {
      header: () => <SortButton name="Status" column="status" params={params} onSort={onSort} />,
      cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
    }),
    helper.accessor("createdAt", {
      header: () => (
        <SortButton name="Created" column="createdAt" params={params} onSort={onSort} />
      ),
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    }),
  ]);

  const table = useTable({ features, columns, data: tasks });

  return (
    <div className="overflow-hidden rounded-md border">
      {/* table-fixed: layout is content-independent so columns never shift;
          the widthless title column absorbs the remaining space. The <col>s
          follow the column order above. */}
      <Table className="table-fixed">
        <colgroup>
          <col />
          <col className="w-32" />
          <col className="w-28" />
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.original.id} className="relative">
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <span className="text-muted-foreground">No tasks found.</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SortButton({
  name,
  column,
  params,
  onSort,
}: {
  name: string;
  column: TaskListParams["sort"];
  params: TaskListParams;
  onSort: Props["onSort"];
}) {
  const sorted = params.sort === column;
  const Icon = params.order === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Button variant="ghost" size="sm" className="-ml-3" onClick={() => onSort(column)}>
      {name}
      {sorted && <Icon className="size-4" weight="bold" />}
    </Button>
  );
}
