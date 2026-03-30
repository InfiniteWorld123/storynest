import { AuthShell } from "#/components/auth/layout/auth-shell";
import { AuthPanel } from "#/components/auth/layout/auth-panel";
import { AuthAside } from "#/components/auth/layout/auth-aside";
import { AuthPageHeader } from "#/components/auth/shared/auth-page-header";
import { AuthFormShell } from "#/components/auth/shared/auth-form-shell";
import { AuthField } from "#/components/auth/shared/auth-field";
import { AuthFooterLinks } from "#/components/auth/shared/auth-footer-links";
import { useForm } from "@tanstack/react-form";
import { signIn } from "#/lib/auth-client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitButton } from "#/components/ui/submit-button";

export function SignInPage() {
  const navigate = useNavigate();
  const [errorSignIn, setErrorSignIn] = useState<string | null>(null);
  const { handleSubmit, Field, reset, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created successfully");
            reset();
            setErrorSignIn(null);
            navigate({ to: "/app/overview" });
          },
          onError: (ctx) => {
            setErrorSignIn(ctx.error.message);
            toast.error("Failed to sign in");
          },
        },
      });
    },
  });

  return (
    <AuthShell>
      <AuthPanel>
        <AuthPageHeader
          title="Welcome back"
          description="Sign in to continue your journey through stories."
        />
        <AuthFormShell onSubmit={handleSubmit}>
          <Field name="email">
            {(field) => (
              <AuthField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            )}
          </Field>

          <Field name="password">
            {(field) => (
              <AuthField
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            )}
          </Field>

          <Subscribe>
            {({ isSubmitting }) => (
              <SubmitButton
                className="w-full dark:bg-foreground dark:text-background"
                isLoading={isSubmitting}
                loadingText="Signing in..."
              >
                Sign In
              </SubmitButton>
            )}
          </Subscribe>
        </AuthFormShell>
        <AuthFooterLinks
          links={[
            {
              prefix: "Forgot your password?",
              label: "Reset it",
              to: "/forgot-password",
            },
            {
              prefix: "Don't have an account?",
              label: "Sign up",
              to: "/sign-up",
            },
          ]}
        />
        {errorSignIn && <p className="text-red-500">{errorSignIn}</p>}
      </AuthPanel>
      <AuthAside
        title="Welcome back to StoryNest"
        description="Continue your journey through stories that matter. Your bookmarks, drafts, and community are waiting."
      />
    </AuthShell>
  );
}
