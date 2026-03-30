import { Mail, CheckCircle } from "lucide-react";
import { AuthShell } from "#/components/auth/layout/auth-shell";
import { AuthPanel } from "#/components/auth/layout/auth-panel";
import { AuthAside } from "#/components/auth/layout/auth-aside";
import { AuthPageHeader } from "#/components/auth/shared/auth-page-header";
import { AuthFormShell } from "#/components/auth/shared/auth-form-shell";
import { AuthField } from "#/components/auth/shared/auth-field";
import { AuthFooterLinks } from "#/components/auth/shared/auth-footer-links";
import { AuthStatusCard } from "#/components/auth/shared/auth-status-card";
import { useForm } from "@tanstack/react-form";
import { ForgotPasswordSchema } from "#/validation/auth.schema";
import { toast } from "sonner";
import { requestPasswordReset } from "#/lib/auth-client";
import { useState } from "react";
import { SubmitButton } from "#/components/ui/submit-button";
import { Button } from "#/components/ui/button";

export function ForgotPasswordPage() {
  const [errorForgotPassword, setErrorForgotPassword] = useState<
    string | null
  >(null);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  const { handleSubmit, Field, reset, Subscribe } = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await requestPasswordReset({
        email: value.email,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Reset password link sent successfully");
            setSentToEmail(value.email);
            setErrorForgotPassword(null);
          },
          onError: (ctx) => {
            const message =
              ctx.error.message || "Failed to send reset link";
            toast.error(message);
            setErrorForgotPassword(message);
          },
        },
      });
    },
    validators: {
      onSubmit: ForgotPasswordSchema,
      onChange: ForgotPasswordSchema,
    },
  });

  return (
    <AuthShell>
      <AuthPanel>
        {sentToEmail ? (
          <>
            <AuthPageHeader
              title="Check your email"
              description={`We've sent a password reset link to ${sentToEmail}.`}
            />
            <div className="mt-8 space-y-6">
              <AuthStatusCard
                icon={<Mail className="h-6 w-6" />}
                title="Reset link sent"
                description="Click the link in the email to reset your password."
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span>Check your spam folder if you don't see it</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span>The link expires in 1 hour</span>
                  </div>
                </div>
              </AuthStatusCard>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  setSentToEmail(null);
                  reset();
                }}
              >
                Try a different email
              </Button>
            </div>
          </>
        ) : (
          <>
            <AuthPageHeader
              title="Forgot your password?"
              description="Enter your email address and we'll send you a link to reset it."
            />
            <AuthFormShell onSubmit={handleSubmit}>
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                    loadingText="Sending reset link..."
                  >
                    Send Reset Link
                  </SubmitButton>
                )}
              </Subscribe>
            </AuthFormShell>
            {errorForgotPassword && (
              <p className="mt-4 text-sm text-center text-destructive">
                {errorForgotPassword}
              </p>
            )}
          </>
        )}
        <AuthFooterLinks
          links={[
            {
              prefix: "Remember your password?",
              label: "Sign in",
              to: "/sign-in",
            },
          ]}
        />
      </AuthPanel>
      <AuthAside
        title="It happens to the best of us"
        description="We'll help you get back to your stories in no time."
      />
    </AuthShell>
  );
}
