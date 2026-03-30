import { createMiddleware } from "@tanstack/react-start";
import { auth } from "#/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { unauthorizedError } from "#/errors/app-error";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw unauthorizedError();
    }

    // Make session available in server function via context
    return next({
      context: {
        session,
      },
    });
  },
);
