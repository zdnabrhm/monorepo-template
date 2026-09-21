import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@monorepo/ui/components/alert";
import { Button } from "@monorepo/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@monorepo/ui/components/field";
import { Input } from "@monorepo/ui/components/input";
import { Spinner } from "@monorepo/ui/components/spinner";

import { authClient } from "@/modules/auth/auth-client";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter a name."),
  email: z.email("Enter a valid email address."),
});

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: { name, email },
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      setError(undefined);
      setSuccess(false);

      const newName = value.name.trim();
      const newEmail = value.email.trim();

      if (newEmail.toLowerCase() !== email.trim().toLowerCase()) {
        const { error } = await authClient.changeEmail({ newEmail });

        if (error) {
          setError(error.message ?? "Could not change your email.");

          return;
        }
      }

      if (newName !== name.trim()) {
        const { error } = await authClient.updateUser({ name: newName });

        if (error) {
          setError(error.message ?? "Could not update your name.");

          return;
        }
      }

      await router.invalidate();
      setSuccess(true);
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {error && (
        <Alert variant="destructive">
          <XCircleIcon aria-hidden="true" />
          <AlertTitle>Unable to update your profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <CheckCircleIcon aria-hidden="true" />
          <AlertTitle>Profile updated</AlertTitle>
        </Alert>
      )}
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          hasChanges:
            state.values.name.trim() !== name.trim() ||
            state.values.email.trim().toLowerCase() !== email.trim().toLowerCase(),
        })}
      >
        {({ canSubmit, isSubmitting, hasChanges }) => (
          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit || !hasChanges}>
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving...
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
