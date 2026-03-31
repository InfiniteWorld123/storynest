import { createAuthClient } from "better-auth/react";

const resolvedBaseUrl =
    typeof window !== "undefined" ? window.location.origin : undefined;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: resolvedBaseUrl
});

export const 
{
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    resetPassword,
    requestPasswordReset,
    getSession,
    useSession,
    updateUser,
    changeEmail,
    changePassword,
    deleteUser,
} 
= authClient;
