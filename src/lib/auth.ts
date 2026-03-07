import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "#/db/drizzle";
import * as schema from "#/db/schema";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "#/constants/env";
import { sendEmail } from "./mailer";

export const auth = betterAuth({
    baseURL: env.BASE_URL,
    secret: env.API_KEY,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }, _request) => {
            await sendEmail({
                to: user.email,
                subject: "Reset Password",
                html: `<p>Click the link below to reset your password:</p>
                <p><a href="${url}">Reset Password</a></p>`,
            });
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }, _request) => {
            console.log("sendVerificationEmail", url);
            await sendEmail({
                to: user.email,
                subject: "Verify your email",
                html: `<p>Click the link below to verify your email:</p>
                <p><a href="${url}">Verify Email</a></p>`,
            });
        }
    },
    plugins: [tanstackStartCookies()],
});
