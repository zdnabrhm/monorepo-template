import * as React from "react";
import { XCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@monorepo/ui/components/alert";
import { Button } from "@monorepo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@monorepo/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@monorepo/ui/components/field";
import { Input } from "@monorepo/ui/components/input";
import { cn } from "@monorepo/ui/lib/utils";

import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

const signInSchema = z.object({
  name: z.string(),
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1, "Enter your name."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<AuthMode>("sign-in");
  const [authError, setAuthError] = React.useState<string>();
  const isSignUp = mode === "sign-up";

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: isSignUp ? signUpSchema : signInSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined);

      const result = isSignUp
        ? await authClient.signUp.email({
            name: value.name.trim(),
            email: value.email,
            password: value.password,
          })
        : await authClient.signIn.email({
            email: value.email,
            password: value.password,
          });

      if (result.error) {
        setAuthError(result.error.message ?? "Authentication failed.");

        return;
      }

      await navigate({ to: "/" });
    },
  });

  function changeMode() {
    setAuthError(undefined);
    form.reset();
    setMode(isSignUp ? "sign-in" : "sign-up");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Enter your details to get started" : "Enter your email and password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <XCircleIcon aria-hidden="true" />
                <AlertTitle>
                  {isSignUp ? "Unable to create account" : "Unable to sign in"}
                </AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              {isSignUp && (
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
              )}
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
              <form.Field name="password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        aria-required="true"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
              <Field>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Please wait..." : isSignUp ? "Sign up" : "Login"}
                    </Button>
                  )}
                </form.Subscribe>
                <FieldDescription className="text-center">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <Button type="button" variant="link" className="h-auto p-0" onClick={changeMode}>
                    {isSignUp ? "Login" : "Sign up"}
                  </Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
