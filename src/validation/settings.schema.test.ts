import { describe, expect, it } from "vitest";
import {
  SettingsDeleteAccountSchema,
  SettingsPasswordSchema,
  SettingsProfileSchema,
} from "#/validation/settings.schema";

describe("SettingsProfileSchema", () => {
  it("normalizes and validates profile input", () => {
    const result = SettingsProfileSchema.parse({
      name: "  Alex Morgan  ",
      email: "  ALEX@Example.COM  ",
    });

    expect(result).toEqual({
      name: "Alex Morgan",
      email: "alex@example.com",
    });
  });

  it("rejects empty display names", () => {
    const result = SettingsProfileSchema.safeParse({
      name: "   ",
      email: "alex@example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Display name cannot be empty.");
    }
  });
});

describe("SettingsPasswordSchema", () => {
  it("rejects weak passwords", () => {
    const result = SettingsPasswordSchema.safeParse({
      currentPassword: "Current123!",
      newPassword: "weak",
      confirmPassword: "weak",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Password must be at least 12 characters long");
    }
  });

  it("rejects confirmation mismatches", () => {
    const result = SettingsPasswordSchema.safeParse({
      currentPassword: "Current123!",
      newPassword: "StrongPassword123!",
      confirmPassword: "StrongPassword123!!",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Passwords do not match.");
    }
  });
});

describe("SettingsDeleteAccountSchema", () => {
  it("requires password confirmation", () => {
    const result = SettingsDeleteAccountSchema.safeParse({ password: " " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Password is required to delete your account.",
      );
    }
  });
});
