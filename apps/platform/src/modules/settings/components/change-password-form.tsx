import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@monorepo/ui/components/alert";
import { Button } from "@monorepo/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@monorepo/ui/components/field";
import { Input } from "@monorepo/ui/components/input";
import { Spinner } from "@monorepo/ui/components/spinner";

import { authClient } from "@/modules/auth/auth-client";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be at most 128 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm() {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      setError(undefined);
      setSuccess(false);

      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setError(error.message ?? "Could not change your password.");

        return;
      }

      setSuccess(true);
      form.reset();
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
          <AlertTitle>Unable to change password</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <CheckCircleIcon aria-hidden="true" />
          <AlertTitle>Password changed</AlertTitle>
        </Alert>
      )}
      <FieldGroup>
        <form.Field name="currentPassword">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="newPassword">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="new-password"
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
        selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
      >
        {({ canSubmit, isSubmitting }) => (
          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving...
                </>
              ) : (
                "Change password"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
