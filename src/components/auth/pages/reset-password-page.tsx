import { AuthShell } from "#/components/auth/layout/auth-shell";
import { AuthPanel } from "#/components/auth/layout/auth-panel";
import { AuthAside } from "#/components/auth/layout/auth-aside";
import { AuthPageHeader } from "#/components/auth/shared/auth-page-header";
import { AuthFormShell } from "#/components/auth/shared/auth-form-shell";
import { AuthField } from "#/components/auth/shared/auth-field";
import { AuthFooterLinks } from "#/components/auth/shared/auth-footer-links";
import { useForm } from "@tanstack/react-form";
import { ResetPasswordSchema } from "#/validation/auth.schema";
import { SubmitButton } from "#/components/ui/submit-button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { resetPassword } from "#/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

type ResetPasswordPageProps = {
  token: string | undefined;
  searchError: string | undefined;
};

export function ResetPasswordPage({
  token,
  searchError,
}: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const [errorResetPassword, setErrorResetPassword] = useState<string | null>(
    null,
  );

  const resolvedSearchError =
    searchError === "INVALID_TOKEN"
      ? "This reset link is invalid or expired. Please request a new one."
      : searchError;

  useEffect(() => {
    if (resolvedSearchError) {
      setErrorResetPassword(resolvedSearchError);
      return;
    }

    if (!token) {
      navigate({ to: "/forgot-password", replace: true });
    }
  }, [navigate, resolvedSearchError, token]);

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (!token || resolvedSearchError) {
        const message = resolvedSearchError || "Reset token not found";
        setErrorResetPassword(message);
        toast.error(message);
        return;
      }

      await resetPassword({
        newPassword: value.password,
        token,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Password reset successfully");
            reset();
            setErrorResetPassword(null);
            navigate({ to: "/sign-in" });
          },
          onError: (ctx) => {
            setErrorResetPassword(ctx.error.message);
            toast.error(ctx.error.message);
          },
        },
      });
    },
    validators: {
      onSubmit: ResetPasswordSchema,
      onChange: ResetPasswordSchema,
    },
  });
  return (
    <AuthShell>
      <AuthPanel>
        <AuthPageHeader
          title="Reset your password"
          description="Choose a new password for your account."
        />
        <AuthFormShell onSubmit={handleSubmit}>
          <Field name="password">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              const error = errors[0]?.message;
              return (
                <AuthField
                  id="password"
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  description="Must be 12+ chars with one uppercase letter, one number, and one special character."
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
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  description="Confirm your new password."
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
                loadingText="Resetting password..."
              >
                Reset Password
              </SubmitButton>
            )}
          </Subscribe>
        </AuthFormShell>
        <AuthFooterLinks
          links={[
            {
              prefix: "Back to",
              label: "Sign in",
              to: "/sign-in",
            },
          ]}
        />
        {errorResetPassword && (
          <p className="text-red-500 text-sm text-center">
            {errorResetPassword}
          </p>
        )}
      </AuthPanel>
      <AuthAside
        title="Almost there"
        description="Set your new password and get back to the stories you love."
      />
    </AuthShell>
  );
}
