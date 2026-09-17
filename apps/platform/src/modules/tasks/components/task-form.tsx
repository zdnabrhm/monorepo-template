import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@monorepo/ui/components/button";
import { Field, FieldError, FieldLabel } from "@monorepo/ui/components/field";
import { Input } from "@monorepo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monorepo/ui/components/select";
import { Textarea } from "@monorepo/ui/components/textarea";
import { createTask, updateTask } from "../api";
import { taskKeys } from "../queries";
import { taskListSearchSchema, taskStatusSchema } from "../schema";
import type { Task, TaskInput } from "../schema";

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a title.")
    .max(200, "Keep the title under 200 characters."),
  description: z.string().max(2000, "Keep the description under 2000 characters."),
  status: taskStatusSchema,
});

const statusOptions = [
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export function TaskForm({ task }: { task?: Task }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();

  const save = useMutation({
    mutationFn: (input: TaskInput) => (task ? updateTask(task.id, input) : createTask(input)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await navigate({ to: "/tasks", search: (previous) => taskListSearchSchema.parse(previous) });
    },
  });

  const form = useForm({
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? taskStatusSchema.enum.todo,
    },
    validators: { onSubmit: taskSchema },
    onSubmit: async ({ value }) => {
      setError(undefined);

      try {
        await save.mutateAsync({ ...value, title: value.title.trim() });
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not save task.");
      }
    },
  });

  return (
    <div className="w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">{task ? "Edit task" : "New task"}</h1>
      <form
        className="grid gap-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="title">
          {(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                items={statusOptions}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(taskStatusSchema.parse(value))}
              >
                <SelectTrigger id={field.name} className="w-full" onBlur={field.handleBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void navigate(
                task
                  ? {
                      to: "/tasks/$taskId",
                      params: { taskId: task.id },
                      search: (previous) => taskListSearchSchema.parse(previous),
                    }
                  : {
                      to: "/tasks",
                      search: (previous) => taskListSearchSchema.parse(previous),
                    },
              )
            }
          >
            Cancel
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(submitting) => (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save task"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
