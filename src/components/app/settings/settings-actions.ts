import {
  SettingsDeleteAccountSchema,
  SettingsPasswordSchema,
  SettingsProfileSchema,
} from "#/validation/settings.schema";

export type InlineFeedback = { ok: boolean; msg: string };

type ProfileInput = {
  name: string;
  email: string;
};

type SessionUser = {
  name: string;
  email: string;
};

type ProfileActionDeps = {
  updateUserFn: (input: {
    name: string;
    fetchOptions: { throw: true };
  }) => Promise<unknown>;
  changeEmailFn: (input: {
    newEmail: string;
    callbackURL: string;
    fetchOptions: { throw: true };
  }) => Promise<unknown>;
};

type PasswordActionDeps = {
  changePasswordFn: (input: {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions: true;
    fetchOptions: { throw: true };
  }) => Promise<unknown>;
};

type DeleteActionDeps = {
  deleteUserFn: (input: {
    password: string;
    callbackURL: string;
    fetchOptions: { throw: true };
  }) => Promise<unknown>;
};

export function normalizeName(name: string) {
  return name.trim();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function mapAuthErrorMessage(input: string) {
  const message = input.trim();
  const lowered = message.toLowerCase();

  if (lowered.includes("invalid password")) {
    return "Current password is incorrect.";
  }
  if (lowered.includes("password is incorrect")) {
    return "Current password is incorrect.";
  }
  if (lowered.includes("session expired")) {
    return "Your session is no longer fresh. Please sign in again and retry.";
  }
  if (lowered.includes("change email is disabled")) {
    return "Email changes are currently disabled.";
  }
  if (lowered.includes("delete user is disabled")) {
    return "Account deletion is currently unavailable right now.";
  }
  if (lowered.includes("verification email") && lowered.includes("enabled")) {
    return "Email verification is not configured yet. Please contact support.";
  }
  if (lowered.includes("email is the same")) {
    return "Please use a different email address.";
  }

  return message;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return mapAuthErrorMessage(maybeMessage);
    }

    const nestedMessage = (error as { error?: { message?: unknown } }).error?.message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) {
      return mapAuthErrorMessage(nestedMessage);
    }
  }

  return fallback;
}

export async function runProfileUpdateAction({
  sessionUser,
  input,
  deps,
}: {
  sessionUser: SessionUser | null;
  input: ProfileInput;
  deps: ProfileActionDeps;
}): Promise<{ feedback: InlineFeedback; shouldRefetch: boolean }> {
  if (!sessionUser) {
    return {
      feedback: { ok: false, msg: "Unable to load your session. Please refresh and try again." },
      shouldRefetch: false,
    };
  }

  const parsed = SettingsProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      feedback: { ok: false, msg: parsed.error.issues[0]?.message ?? "Invalid profile data." },
      shouldRefetch: false,
    };
  }

  const nextProfile = {
    name: normalizeName(parsed.data.name),
    email: normalizeEmail(parsed.data.email),
  };

  const initialProfile = {
    name: normalizeName(sessionUser.name),
    email: normalizeEmail(sessionUser.email),
  };

  const hasNameChange = nextProfile.name !== initialProfile.name;
  const hasEmailChange = nextProfile.email !== initialProfile.email;

  if (!hasNameChange && !hasEmailChange) {
    return {
      feedback: { ok: true, msg: "No profile changes to save." },
      shouldRefetch: false,
    };
  }

  let updatedName = false;

  try {
    if (hasNameChange) {
      await deps.updateUserFn({
        name: nextProfile.name,
        fetchOptions: { throw: true },
      });
      updatedName = true;
    }

    if (hasEmailChange) {
      await deps.changeEmailFn({
        newEmail: nextProfile.email,
        callbackURL: "/app/settings",
        fetchOptions: { throw: true },
      });

      if (updatedName) {
        return {
          feedback: { ok: true, msg: "Profile updated. Verification email sent to your new address." },
          shouldRefetch: true,
        };
      }

      return {
        feedback: { ok: true, msg: "Verification email sent to your new address." },
        shouldRefetch: true,
      };
    }

    return {
      feedback: { ok: true, msg: "Profile updated." },
      shouldRefetch: true,
    };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to update profile. Please try again.");
    if (updatedName && hasEmailChange) {
      return {
        feedback: { ok: false, msg: `Name updated, but email change failed: ${message}` },
        shouldRefetch: true,
      };
    }

    return {
      feedback: { ok: false, msg: message },
      shouldRefetch: false,
    };
  }
}

export async function runPasswordChangeAction({
  sessionUser,
  currentPassword,
  newPassword,
  confirmPassword,
  deps,
}: {
  sessionUser: SessionUser | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  deps: PasswordActionDeps;
}): Promise<{ feedback: InlineFeedback; clearPasswords: boolean }> {
  if (!sessionUser) {
    return {
      feedback: { ok: false, msg: "Unable to load your session. Please refresh and try again." },
      clearPasswords: false,
    };
  }

  const parsed = SettingsPasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!parsed.success) {
    return {
      feedback: { ok: false, msg: parsed.error.issues[0]?.message ?? "Invalid password input." },
      clearPasswords: false,
    };
  }

  try {
    await deps.changePasswordFn({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
      revokeOtherSessions: true,
      fetchOptions: { throw: true },
    });

    return {
      feedback: { ok: true, msg: "Password changed. Other sessions have been signed out." },
      clearPasswords: true,
    };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to change password. Please try again.");
    return {
      feedback: { ok: false, msg: message },
      clearPasswords: false,
    };
  }
}

export async function runDeleteAccountAction({
  sessionUser,
  password,
  deps,
}: {
  sessionUser: SessionUser | null;
  password: string;
  deps: DeleteActionDeps;
}): Promise<{ feedback: InlineFeedback; shouldRedirect: boolean }> {
  if (!sessionUser) {
    return {
      feedback: { ok: false, msg: "Unable to load your session. Please refresh and try again." },
      shouldRedirect: false,
    };
  }

  const parsed = SettingsDeleteAccountSchema.safeParse({ password });
  if (!parsed.success) {
    return {
      feedback: { ok: false, msg: parsed.error.issues[0]?.message ?? "Password is required." },
      shouldRedirect: false,
    };
  }

  try {
    await deps.deleteUserFn({
      password: parsed.data.password,
      callbackURL: "/",
      fetchOptions: { throw: true },
    });

    return {
      feedback: { ok: true, msg: "Account deleted successfully." },
      shouldRedirect: true,
    };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to delete account. Please try again.");
    return {
      feedback: { ok: false, msg: message },
      shouldRedirect: false,
    };
  }
}
