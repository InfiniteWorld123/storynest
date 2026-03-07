import { EmailSchema, ResetPasswordSchema, SignInSchema, SignUpSchema, type EmailType, type SignInType, type SignUpType, type ResetPasswordType } from "#/validation/auth.schema";
import { createServerFn } from "@tanstack/react-start";
import { catchAsyncFn } from "#/lib/error-handler";
import { jsonOk } from "#/constants/json";
import { auth } from "#/lib/auth";
import { HttpStatusCode } from "#/constants/http";
import { env } from "#/constants/env";
import { getRequestHeaders } from "@tanstack/react-start/server";

const baseUrl = new URL(env.BASE_URL);

const DEFAULT_CALLBACK_PATH = "/app/overview";
const DEFAULT_RESET_PASSWORD_PATH = "/reset-password";

const DEFAULT_CALLBACK_URL = new URL(DEFAULT_CALLBACK_PATH, baseUrl).toString();
const DEFAULT_RESET_PASSWORD_URL = new URL(DEFAULT_RESET_PASSWORD_PATH, baseUrl).toString();


export const signUp = createServerFn({ method: 'POST' })
    .inputValidator(SignUpSchema)
    .handler(catchAsyncFn(async ({ data }: { data: SignUpType }): Promise<any> => {
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
    }));

export const signIn = createServerFn({ method: 'POST' })
    .inputValidator(SignInSchema)
    .handler(catchAsyncFn(async ({ data }: { data: SignInType }): Promise<any> => {
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
    }));

export const signOut = createServerFn({ method: 'POST' })
    .handler(catchAsyncFn(async (): Promise<any> => {
        const headers = getRequestHeaders();
        const result = await auth.api.signOut({
            headers,
        });

        return jsonOk({
            data: result,
            status: HttpStatusCode.OK,
            message: "User signed out successfully",
        });
    }));

export const forgotPassword = createServerFn({ method: "POST" })
    .inputValidator(EmailSchema)
    .handler(catchAsyncFn(async ({ data }: { data: EmailType }): Promise<any> => {
        const result = await auth.api.requestPasswordReset({
            body: {
                email: data.email,
                redirectTo: DEFAULT_RESET_PASSWORD_URL
            }
        })

        return jsonOk({
            data: result,
            status: HttpStatusCode.OK,
            message: "request reset password is send successfully",
        });
    }));


export const resetPassword = createServerFn({ method: "POST" })
    .inputValidator(ResetPasswordSchema)
    .handler(catchAsyncFn(async ({ data, token }: { data: ResetPasswordType, token: string }): Promise<any> => {
        const result = await auth.api.resetPassword({
            body: {
                newPassword: data.password,
                token,
            }
        })

        return jsonOk({
            data: result,
            status: HttpStatusCode.OK,
            message: "password reset successfully",
        });
    }));

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    return session;
});

export const ensureSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
});
