import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { story, storyCategory, storySave } from "#/db/schema";
import { catchAsyncFn } from "#/errors/error-handler";
import { authMiddleware } from "#/middleware/auth.middleware";
import type { PaginatedResource } from "#/server/api.types";
import type { ServerOk } from "#/server/_types";
import {
  getReadLaterCountSchema,
  getReadLaterStoriesSchema,
  removeReadLaterSchema,
  saveReadLaterSchema,
} from "#/validation/read-later.schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq } from "drizzle-orm";
import type { StoryContent } from "#/types/story";

type ReadLaterItem = {
  storyId: string;
  savedAt: string;
  story: {
    id: string;
    userId: string;
    categoryId: string;
    title: string;
    description: string;
    content: StoryContent;
    coverImageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

type PaginatedReadLater = PaginatedResource<"stories", ReadLaterItem>;

export const getReadLaterCount = createServerFn({ method: "GET" })
  .inputValidator(getReadLaterCountSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<{ storyId: string; saves: number }> => {
      const [{ saves }] = await db
        .select({ saves: count() })
        .from(storySave)
        .where(eq(storySave.storyId, data.storyId));

      return jsonOk({
        data: {
          storyId: data.storyId,
          saves,
        },
        message: "Read later count loaded successfully",
      });
    }),
  );

export const getMyReadLaterCount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    catchAsyncFn(async ({ context }): ServerOk<{ total: number }> => {
      const { session } = context;
      const [{ total }] = await db
        .select({ total: count() })
        .from(storySave)
        .where(eq(storySave.userId, session.user.id));

      return jsonOk({
        data: { total: Number(total) },
        message: "Read later total loaded successfully",
      });
    }),
  );

export const saveReadLater = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(saveReadLaterSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<{ storyId: string; savedAt: string }> => {
      const { session } = context;
      const { storyId } = data;

      const existing = await db
        .select({
          storyId: storySave.storyId,
          createdAt: storySave.createdAt,
        })
        .from(storySave)
        .where(
          and(eq(storySave.storyId, storyId), eq(storySave.userId, session.user.id)),
        )
        .limit(1);

      if (existing[0]) {
        return jsonOk({
          data: {
            storyId: existing[0].storyId,
            savedAt: existing[0].createdAt.toISOString(),
          },
          message: "Story already saved for later",
        });
      }

      const [inserted] = await db
        .insert(storySave)
        .values({
          storyId,
          userId: session.user.id,
        })
        .returning({
          storyId: storySave.storyId,
          createdAt: storySave.createdAt,
        });

      return jsonOk({
        data: {
          storyId: inserted.storyId,
          savedAt: inserted.createdAt.toISOString(),
        },
        status: HttpStatusCode.CREATED,
        message: "Story saved for later",
      });
    }),
  );

export const removeReadLater = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(removeReadLaterSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<{ storyId: string }> => {
      const { session } = context;
      const { storyId } = data;

      await db
        .delete(storySave)
        .where(and(eq(storySave.storyId, storyId), eq(storySave.userId, session.user.id)));

      return jsonOk({
        data: { storyId },
        message: "Story removed from read later",
      });
    }),
  );

export const getReadLaterStories = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getReadLaterStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<PaginatedReadLater> => {
      const { session } = context;
      const { page, limit, sortBy } = data;
      const offset = (page - 1) * limit;

      const orderBy = sortBy === "oldest" ? asc(storySave.createdAt) : desc(storySave.createdAt);

      const [{ total }] = await db
        .select({ total: count() })
        .from(storySave)
        .where(eq(storySave.userId, session.user.id));

      const hasMore = page * limit < total;

      const rows = await db
        .select({
          storyId: storySave.storyId,
          savedAt: storySave.createdAt,
          id: story.id,
          userId: story.userId,
          categoryId: story.categoryId,
          title: story.title,
          description: story.description,
          content: story.content,
          coverImageUrl: story.coverImageUrl,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          categoryIdJoined: storyCategory.id,
          categoryName: storyCategory.name,
          categorySlug: storyCategory.slug,
        })
        .from(storySave)
        .innerJoin(story, eq(storySave.storyId, story.id))
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(eq(storySave.userId, session.user.id))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      const stories: ReadLaterItem[] = rows.map((row) => ({
        storyId: row.storyId,
        savedAt: row.savedAt.toISOString(),
        story: {
          id: row.id,
          userId: row.userId,
          categoryId: row.categoryId,
          title: row.title,
          description: row.description,
          content: row.content as StoryContent,
          coverImageUrl: row.coverImageUrl,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          category: {
            id: row.categoryIdJoined,
            name: row.categoryName,
            slug: row.categorySlug,
          },
        },
      }));

      return jsonOk({
        data: {
          stories,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore,
          },
        },
        message: "Read later stories loaded successfully",
      });
    }),
  );
