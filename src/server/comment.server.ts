import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storyComment } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { catchAsyncFn } from "#/errors/error-handler";
import { authMiddleware } from "#/middleware/auth.middleware";
import type { PaginatedResource } from "#/server/api.types";
import type { ServerOk } from "#/server/_types";
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "#/validation/comment.schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq } from "drizzle-orm";

type CommentPayload = {
  id: string;
  storyId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type CommentPageData = PaginatedResource<"comments", CommentPayload> & {
  storyId: string;
};

export const createComment = createServerFn({ method: "POST" })
  .inputValidator(createCommentSchema)
  .middleware([authMiddleware])
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<{ commentId: string }> => {
      const { session } = context;
      const { storyId, content } = data;
      const commentId = crypto.randomUUID();

      await db.insert(storyComment).values({
        id: commentId,
        storyId,
        userId: session.user.id,
        content,
      });

      return jsonOk({
        data: { commentId },
        status: HttpStatusCode.CREATED,
        message: "Comment created successfully",
      });
    }),
  );

export const deleteComment = createServerFn({ method: "POST" })
  .inputValidator(deleteCommentSchema)
  .middleware([authMiddleware])
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<{ commentId: string }> => {
      const { session } = context;
      const { commentId } = data;

      const existingComments = await db
        .select()
        .from(storyComment)
        .where(
          and(
            eq(storyComment.id, commentId),
            eq(storyComment.userId, session.user.id),
          ),
        );

      if (!existingComments[0]) {
        throw notFoundError("Comment not found");
      }

      await db
        .delete(storyComment)
        .where(
          and(
            eq(storyComment.id, commentId),
            eq(storyComment.userId, session.user.id),
          ),
        );

      return jsonOk({
        data: { commentId },
        message: "Comment deleted successfully",
      });
    }),
  );

export const updateComment = createServerFn({ method: "POST" })
  .inputValidator(updateCommentSchema)
  .middleware([authMiddleware])
  .handler(
    catchAsyncFn(
      async ({
        data,
        context,
      }): ServerOk<{ commentId: string; content: string }> => {
        const { session } = context;
        const { commentId, content } = data;

        const existingComments = await db
          .select()
          .from(storyComment)
          .where(
            and(
              eq(storyComment.id, commentId),
              eq(storyComment.userId, session.user.id),
            ),
          );

        if (!existingComments[0]) {
          throw notFoundError("Comment not found");
        }

        await db
          .update(storyComment)
          .set({ content })
          .where(
            and(
              eq(storyComment.id, commentId),
              eq(storyComment.userId, session.user.id),
            ),
          );

        return jsonOk({
          data: { commentId, content },
          message: "Comment updated successfully",
        });
      },
    ),
  );

export const getUserComments = createServerFn({ method: "GET" })
  .inputValidator(getCommentsSchema)
  .middleware([authMiddleware])
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<CommentPageData> => {
      const { session } = context;
      const { storyId, sortBy, page, limit } = data;
      const offset = (page - 1) * limit;

      const orderBy =
        sortBy === "oldest"
          ? asc(storyComment.createdAt)
          : sortBy === "az"
            ? asc(storyComment.content)
            : sortBy === "za"
              ? desc(storyComment.content)
              : desc(storyComment.createdAt);

      const whereClause = and(
        eq(storyComment.storyId, storyId),
        eq(storyComment.userId, session.user.id),
      );

      const [{ total }] = await db
        .select({ total: count() })
        .from(storyComment)
        .where(whereClause);

      const hasMore = page * limit < total;
      const comments = await db
        .select()
        .from(storyComment)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return jsonOk({
        data: {
          storyId,
          comments,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore,
          },
        },
        message: "Comments loaded successfully",
      });
    }),
  );

export const getComments = createServerFn({ method: "GET" })
  .inputValidator(getCommentsSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<CommentPageData> => {
      const { storyId, sortBy, page, limit } = data;
      const offset = (page - 1) * limit;

      const orderBy =
        sortBy === "oldest"
          ? asc(storyComment.createdAt)
          : sortBy === "az"
            ? asc(storyComment.content)
            : sortBy === "za"
              ? desc(storyComment.content)
              : desc(storyComment.createdAt);

      const [{ total }] = await db
        .select({ total: count() })
        .from(storyComment)
        .where(eq(storyComment.storyId, storyId));

      const hasMore = page * limit < total;
      const comments = await db
        .select()
        .from(storyComment)
        .where(eq(storyComment.storyId, storyId))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return jsonOk({
        data: {
          storyId,
          comments,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore,
          },
        },
        message: "Comments loaded successfully",
      });
    }),
  );
