import { describe, expect, it, vi } from "vitest";
import {
  runDeleteAccountAction,
  runPasswordChangeAction,
  runProfileUpdateAction,
} from "#/components/app/settings/settings-actions";

const sessionUser = {
  name: "Alex Morgan",
  email: "alex@example.com",
};

describe("runProfileUpdateAction", () => {
  it("returns a no-op success when nothing changed", async () => {
    const updateUserFn = vi.fn();
    const changeEmailFn = vi.fn();

    const result = await runProfileUpdateAction({
      sessionUser,
      input: { name: "Alex Morgan", email: "alex@example.com" },
      deps: { updateUserFn, changeEmailFn },
    });

    expect(result).toEqual({
      feedback: { ok: true, msg: "No profile changes to save." },
      shouldRefetch: false,
    });
    expect(updateUserFn).not.toHaveBeenCalled();
    expect(changeEmailFn).not.toHaveBeenCalled();
  });

  it("supports partial success when name update succeeds and email update fails", async () => {
    const updateUserFn = vi.fn().mockResolvedValue({ status: true });
    const changeEmailFn = vi.fn().mockRejectedValue(new Error("Email already exists"));

    const result = await runProfileUpdateAction({
      sessionUser,
      input: { name: "Alex Writer", email: "alex.writer@example.com" },
      deps: { updateUserFn, changeEmailFn },
    });

    expect(result.feedback.ok).toBe(false);
    expect(result.feedback.msg).toContain("Name updated, but email change failed:");
    expect(result.shouldRefetch).toBe(true);
    expect(updateUserFn).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Alex Writer" }),
    );
    expect(changeEmailFn).toHaveBeenCalledWith(
      expect.objectContaining({
        newEmail: "alex.writer@example.com",
        callbackURL: "/app/settings",
      }),
    );
  });
});

describe("runPasswordChangeAction", () => {
  it("validates weak passwords before calling the API", async () => {
    const changePasswordFn = vi.fn();

    const result = await runPasswordChangeAction({
      sessionUser,
      currentPassword: "CurrentPass123!",
      newPassword: "weak",
      confirmPassword: "weak",
      deps: { changePasswordFn },
    });

    expect(result.feedback.ok).toBe(false);
    expect(result.feedback.msg).toBe("Password must be at least 12 characters long");
    expect(result.clearPasswords).toBe(false);
    expect(changePasswordFn).not.toHaveBeenCalled();
  });

  it("returns success and clearPasswords when the password update succeeds", async () => {
    const changePasswordFn = vi.fn().mockResolvedValue({ status: true });

    const result = await runPasswordChangeAction({
      sessionUser,
      currentPassword: "CurrentPass123!",
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
      deps: { changePasswordFn },
    });

    expect(result).toEqual({
      feedback: { ok: true, msg: "Password changed. Other sessions have been signed out." },
      clearPasswords: true,
    });
    expect(changePasswordFn).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPassword: "CurrentPass123!",
        newPassword: "StrongPass123!",
        revokeOtherSessions: true,
      }),
    );
  });
});

describe("runDeleteAccountAction", () => {
  it("requires password input before delete call", async () => {
    const deleteUserFn = vi.fn();

    const result = await runDeleteAccountAction({
      sessionUser,
      password: " ",
      deps: { deleteUserFn },
    });

    expect(result).toEqual({
      feedback: { ok: false, msg: "Password is required to delete your account." },
      shouldRedirect: false,
    });
    expect(deleteUserFn).not.toHaveBeenCalled();
  });

  it("maps invalid password failure from delete endpoint", async () => {
    const deleteUserFn = vi.fn().mockRejectedValue(new Error("Invalid password"));

    const result = await runDeleteAccountAction({
      sessionUser,
      password: "WrongPassword123!",
      deps: { deleteUserFn },
    });

    expect(result).toEqual({
      feedback: { ok: false, msg: "Current password is incorrect." },
      shouldRedirect: false,
    });
    expect(deleteUserFn).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "WrongPassword123!",
        callbackURL: "/",
      }),
    );
  });

  it("returns redirect instruction after successful delete", async () => {
    const deleteUserFn = vi.fn().mockResolvedValue({ success: true });

    const result = await runDeleteAccountAction({
      sessionUser,
      password: "CurrentPass123!",
      deps: { deleteUserFn },
    });

    expect(result).toEqual({
      feedback: { ok: true, msg: "Account deleted successfully." },
      shouldRedirect: true,
    });
  });
});
