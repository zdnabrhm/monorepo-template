import { Badge } from "@monorepo/ui/components/badge";
import { statusLabels } from "../schema";
import type { TaskStatus } from "../schema";

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;

const statusVariants: Record<TaskStatus, BadgeVariant> = {
  todo: "secondary",
  in_progress: "info",
  done: "success",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
