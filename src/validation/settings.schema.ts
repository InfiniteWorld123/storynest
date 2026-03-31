import { z } from "zod";

const passwordValidation = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const emailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address");

export const SettingsProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Display name cannot be empty.")
    .max(120, "Display name is too long"),
  email: emailValidation,
});

export const SettingsPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const SettingsDeleteAccountSchema = z.object({
  password: z.string().trim().min(1, "Password is required to delete your account."),
});

export type SettingsProfileType = z.infer<typeof SettingsProfileSchema>;
export type SettingsPasswordType = z.infer<typeof SettingsPasswordSchema>;
export type SettingsDeleteAccountType = z.infer<typeof SettingsDeleteAccountSchema>;
