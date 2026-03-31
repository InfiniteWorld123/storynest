import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { env } from "#/constants/env";
import { unauthorizedError } from "#/errors/app-error";
import type { auth } from "#/lib/auth.server";
import { catchAsyncFn } from "#/errors/error-handler";
import type { ServerOk } from "#/server/_types";
import {
  EmailSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "#/validation/auth.schema";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";

const baseUrl = new URL(env.BASE_URL);

const DEFAULT_CALLBACK_URL = new URL("/app/overview", baseUrl).toString();
const DEFAULT_RESET_PASSWORD_URL = new URL(
  "/reset-password",
  baseUrl,
).toString();

type SignUpResult = Awaited<ReturnType<typeof auth.api.signUpEmail>>;
type SignInResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
type SignOutResult = Awaited<ReturnType<typeof auth.api.signOut>>;
type ForgotPasswordResult = Awaited<
  ReturnType<typeof auth.api.requestPasswordReset>
>;
type ResetPasswordResult = Awaited<ReturnType<typeof auth.api.resetPassword>>;
type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

const resetPasswordServerSchema = ResetPasswordSchema.extend({
  token: z.string().min(1, "Reset token is required"),
});

export const signUp = createServerFn({ method: "POST" })
  .inputValidator(SignUpSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<SignUpResult> => {
      const { auth } = await import("#/lib/auth.server");
      const result = await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: DEFAULT_CALLBACK_URL,
        },
      });

      return jsonOk({
        data: result,
        status: HttpStatusCode.CREATED,
        message: "User created successfully",
      });
    }),
  );

export const signIn = createServerFn({ method: "POST" })
  .inputValidator(SignInSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<SignInResult> => {
      const { auth } = await import("#/lib/auth.server");
      const headers = getRequestHeaders();
      const result = await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
          callbackURL: DEFAULT_CALLBACK_URL,
        },
        headers,
      });

      return jsonOk({
        data: result,
        status: HttpStatusCode.OK,
        message: "User signed in successfully",
      });
    }),
  );

export const signOut = createServerFn({ method: "POST" }).handler(
  catchAsyncFn(async (): ServerOk<SignOutResult> => {
    const { auth } = await import("#/lib/auth.server");
    const headers = getRequestHeaders();
    const result = await auth.api.signOut({ headers });

    return jsonOk({
      data: result,
      status: HttpStatusCode.OK,
      message: "User signed out successfully",
    });
  }),
);

export const forgotPassword = createServerFn({ method: "POST" })
  .inputValidator(EmailSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<ForgotPasswordResult> => {
      const { auth } = await import("#/lib/auth.server");
      const result = await auth.api.requestPasswordReset({
        body: {
          email: data.email,
          redirectTo: DEFAULT_RESET_PASSWORD_URL,
        },
      });

      return jsonOk({
        data: result,
        status: HttpStatusCode.OK,
        message: "Request reset password sent successfully",
      });
    }),
  );

export const resetPassword = createServerFn({ method: "POST" })
  .inputValidator(resetPasswordServerSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<ResetPasswordResult> => {
      const { auth } = await import("#/lib/auth.server");
      const result = await auth.api.resetPassword({
        body: {
          newPassword: data.password,
          token: data.token,
        },
      });

      return jsonOk({
        data: result,
        status: HttpStatusCode.OK,
        message: "Password reset successfully",
      });
    }),
  );

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionResult> => {
    const { auth } = await import("#/lib/auth.server");
    const headers = getRequestHeaders();
    return auth.api.getSession({ headers });
  },
);

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<NonNullable<SessionResult>> => {
    const { auth } = await import("#/lib/auth.server");
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw unauthorizedError();
    }

    return session;
  },
);
