import { HttpStatusCode } from "#/constants/http";
import { jsonError, type JsonError } from "#/constants/json";
import { APIError } from "better-auth/api";

export const handleError = (error: unknown): JsonError => {
    // 1. Better Auth Server API Errors
    if (error instanceof APIError) {
        return jsonError({
            message: error.body?.message || error.message || 'Authentication error',
            status: error.status as HttpStatusCode,
            code: error.body?.code || 'AUTH_ERROR'
        });
    }

    // 2. Generic Error instances
    if (error instanceof Error) {
        // Better Fetch client error check (if thrown from authClient)
        if ('status' in error && 'error' in error) {
            const fetchError = error as any;
            return jsonError({
                message: fetchError.error?.message || fetchError.message || 'Client authentication error',
                status: fetchError.status || HttpStatusCode.BAD_REQUEST,
                code: fetchError.error?.code || 'AUTH_FETCH_ERROR'
            });
        }

        return jsonError({
            message: error.message,
            status: HttpStatusCode.BAD_REQUEST,
            code: 'INTERNAL_ERROR'
        });
    }

    // 3. Fallback
    return jsonError({
        message: 'An unexpected error occurred',
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        code: 'UNKNOWN_ERROR'
    });
};

export const catchAsyncFn = (fn: (...args: any[]) => Promise<any>): (...args: any[]) => Promise<any> => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            throw handleError(error);
        }
    }
}
