import { AuthShell } from "#/components/auth/layout/auth-shell";
import { AuthPanel } from "#/components/auth/layout/auth-panel";
import { AuthAside } from "#/components/auth/layout/auth-aside";
import { AuthPageHeader } from "#/components/auth/shared/auth-page-header";
import { AuthFormShell } from "#/components/auth/shared/auth-form-shell";
import { AuthField } from "#/components/auth/shared/auth-field";
import { AuthFooterLinks } from "#/components/auth/shared/auth-footer-links";
import { useForm } from "@tanstack/react-form";
import { SignUpSchema } from "#/validation/auth.schema";
import { signUp } from "#/lib/auth-client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitButton } from "#/components/ui/submit-button";

export function SignUpPage() {
  const navigate = useNavigate();
  const [errorSignUp, setErrorSignUp] = useState<string | null>(null);
  const { handleSubmit, Field, reset, Subscribe } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      sessionStorage.setItem("signUpEmail", value.email);
      await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created successfully");
            reset();
            setErrorSignUp(null);
            navigate({ to: "/verify-email" });
          },
          onError: (ctx) => {
            setErrorSignUp(ctx.error.message);
            toast.error("Failed to create account");
          },
        },
      });
    },
    validators: {
      onSubmit: SignUpSchema,
      onChange: SignUpSchema,
    },
  });

  return (
    <AuthShell>
      <AuthPanel>
        <AuthPageHeader
          title="Create your account"
          description="Join a community of readers and storytellers."
        />

        <AuthFormShell onSubmit={handleSubmit}>
          <Field name="name">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              const error = errors[0]?.message;
              return (
                <AuthField
                  id="name"
                  label="Full Name"
                  placeholder="Your name"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  error={isTouched && error ? error : undefined}
                />
              );
            }}
          </Field>

          <Field name="email">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              const error = errors[0]?.message;
              return (
                <AuthField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  error={isTouched && error ? error : undefined}
                />
              );
            }}
          </Field>

          <Field name="password">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              const error = errors[0]?.message;
              return (
                <AuthField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  error={isTouched && error ? error : undefined}
                />
              );
            }}
          </Field>

          <Field name="confirmPassword">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              const error = errors[0]?.message;
              return (
                <AuthField
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  error={isTouched && error ? error : undefined}
                />
              );
            }}
          </Field>
          <Subscribe>
            {({ isSubmitting }) => (
              <SubmitButton
                className="w-full dark:bg-foreground dark:text-background"
                isLoading={isSubmitting}
                loadingText="Creating your account..."
              >
                Create Account
              </SubmitButton>
            )}
          </Subscribe>
        </AuthFormShell>

        <AuthFooterLinks
          links={[
            {
              prefix: "Already have an account?",
              label: "Sign in",
              to: "/sign-in",
            },
          ]}
        />
        {errorSignUp && <p className="text-red-500">{errorSignUp}</p>}
      </AuthPanel>

      <AuthAside
        title="Start your story"
        description="StoryNest is where thoughtful writers find their voice and their audience. Begin writing today."
      />
    </AuthShell>
  );
}
