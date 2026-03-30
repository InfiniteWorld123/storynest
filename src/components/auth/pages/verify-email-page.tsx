import { Mail, CheckCircle } from "lucide-react";
import { AuthShell } from "#/components/auth/layout/auth-shell";
import { AuthPanel } from "#/components/auth/layout/auth-panel";
import { AuthAside } from "#/components/auth/layout/auth-aside";
import { AuthPageHeader } from "#/components/auth/shared/auth-page-header";
import { AuthStatusCard } from "#/components/auth/shared/auth-status-card";
import { AuthFooterLinks } from "#/components/auth/shared/auth-footer-links";
import { sendVerificationEmail } from "#/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SubmitButton } from "#/components/ui/submit-button";
import { useNavigate } from "@tanstack/react-router";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [errorResending, setErrorResending] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const storedEmail = window.sessionStorage.getItem("signUpEmail");

    if (!storedEmail) {
      const errorMsg = "Email is missing. Please sign up again."
      setErrorResending(errorMsg)
      toast(errorMsg)
      navigate({ to: '/sign-up' })
      return
    }

    setEmail(storedEmail)
  }, []);

  const onResendVerificationEmail = () => {
    setIsResending(true);
    setErrorResending(null);
    if (!email) {
      setErrorResending("Email not found");
      toast.error("Email not found");
      setIsResending(false);
      return;
    }
    sendVerificationEmail({
      email,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Verification email sent successfully");
          setIsResending(false);
          setErrorResending(null);
          sessionStorage.removeItem("signUpEmail");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Failed to send verification email");
          setIsResending(false);
          setErrorResending(ctx.error.message);
        },
      },
    });
  };

  return (
    <AuthShell>
      <AuthPanel>
        <AuthPageHeader
          title="Verify your email"
          description="We've sent a verification link to your email address."
        />
        <div className="mt-8 space-y-6">
          <AuthStatusCard
            icon={<Mail className="h-6 w-6" />}
            title="Check your inbox"
            description="Click the verification link we sent to complete your account setup."
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                <span>Check your spam folder if you don't see it</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                <span>The link expires will be expired soon</span>
              </div>
            </div>
          </AuthStatusCard>
          <SubmitButton
            className="w-full"
            onClick={onResendVerificationEmail}
            isLoading={isResending}
            loadingText="Resending verification email..."
          >
            Resend Verification Email
          </SubmitButton>
          {errorResending && <p className="text-red-500 text-sm text-center">{errorResending}</p>}
        </div>
        <AuthFooterLinks
          links={[
            {
              prefix: "Back to",
              label: "Sign in",
              to: "/sign-in",
            },
          ]}
        />
      </AuthPanel>
      <AuthAside
        title="One more step"
        description="Verify your email to unlock the full StoryNest experience. Your stories are almost ready."
      />
    </AuthShell>
  );
}
