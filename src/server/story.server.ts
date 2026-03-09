import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { story, storyCategory } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { catchAsyncFn } from "#/errors/error-handler";
import { authMiddleware } from "#/middleware/auth.middleware";
import type { PaginatedResource } from "#/server/api.types";
import type { ServerOk } from "#/server/_types";
import {
  createStorySchema,
  deleteStorySchema,
  getStoriesSchema,
  getStorySchema,
  updateStorySchema,
} from "#/validation/story.schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

type StoryMutationResult = {
  id: string;
};

type StoryRecord = Omit<typeof story.$inferSelect, "content"> & {
  content: Record<string, {}>
};

export type PaginatedStories = PaginatedResource<"stories", StoryRecord>;

export const createStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context;
      const { title, description, categoryId, content, coverImageUrl } = data;
      const storyId = crypto.randomUUID();

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.userId, session.user.id), eq(story.title, title)))
        .limit(1);

      if (existingStories[0]) {
        throw conflictError("Story already exists");
      }

      await db.insert(story).values({
        id: storyId,
        userId: session.user.id,
        categoryId,
        title,
        description,
        content,
        coverImageUrl: coverImageUrl || null,
      });

      return jsonOk({
        data: { id: storyId },
        status: HttpStatusCode.CREATED,
        message: "Story created successfully",
      });
    }),
  );

export const updateStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updateStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context;
      const {
        storyId,
        title,
        description,
        categoryId,
        content,
        coverImageUrl,
      } = data;

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))
        .limit(1);

      const existing = existingStories[0];

      if (!existing) {
        throw notFoundError("Story not found");
      }

      const updatedData = {
        title: title ?? existing.title,
        description: description ?? existing.description,
        categoryId: categoryId ?? existing.categoryId,
        content: content ?? existing.content,
        coverImageUrl:
          coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
      };

      await db
        .update(story)
        .set(updatedData)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)));

      return jsonOk({
        data: { id: storyId },
        message: "Story updated successfully",
      });
    }),
  );

export const deleteStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deleteStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context;
      const { storyId } = data;

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))
        .limit(1);

      if (!existingStories[0]) {
        throw notFoundError("Story not found");
      }

      await db
        .delete(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)));

      return jsonOk({
        data: { id: storyId },
        message: "Story deleted successfully",
      });
    }),
  );

export const getUserStories = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<PaginatedStories> => {
      const { session } = context;
      const { page, limit, category, title, sort } = data;
      const offset = (page - 1) * limit;
      const filters = [eq(story.userId, session.user.id)];

      if (category) {
        filters.push(eq(storyCategory.slug, category));
      }
      if (title?.trim()) {
        filters.push(ilike(story.title, `%${title.trim()}%`));
      }

      const orderBy =
        sort === "oldest"
          ? asc(story.createdAt)
          : sort === "az"
            ? asc(story.title)
            : sort === "za"
              ? desc(story.title)
              : desc(story.createdAt);

      const storyColumns = {
        id: story.id,
        userId: story.userId,
        categoryId: story.categoryId,
        title: story.title,
        description: story.description,
        content: story.content,
        coverImageUrl: story.coverImageUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      };

      const baseFromStory = db.select({ total: count() }).from(story);
      const baseSelectStory = db.select(storyColumns).from(story);

      const countQuery = category
        ? baseFromStory.innerJoin(
            storyCategory,
            eq(story.categoryId, storyCategory.id),
          )
        : baseFromStory;
      const selectQuery = category
        ? baseSelectStory.innerJoin(
            storyCategory,
            eq(story.categoryId, storyCategory.id),
          )
        : baseSelectStory;

      const [{ total }] = await countQuery.where(and(...filters));
      const hasMore = page * limit < total;

      const stories = (await selectQuery
        .where(and(...filters))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
      ) as StoryRecord[];

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
        message: "Stories loaded successfully",
      });
    }),
  );

export const getStories = createServerFn({ method: "GET" })
  .inputValidator(getStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<PaginatedStories> => {
      const { page, limit, category, title, sort } = data;
      const offset = (page - 1) * limit;
      const filters: ReturnType<typeof eq>[] = [];

      if (category) {
        filters.push(eq(storyCategory.slug, category));
      }
      if (title?.trim()) {
        filters.push(ilike(story.title, `%${title.trim()}%`));
      }

      const orderBy =
        sort === "oldest"
          ? asc(story.createdAt)
          : sort === "az"
            ? asc(story.title)
            : sort === "za"
              ? desc(story.title)
              : desc(story.createdAt);

      const storyColumns = {
        id: story.id,
        userId: story.userId,
        categoryId: story.categoryId,
        title: story.title,
        description: story.description,
        content: story.content,
        coverImageUrl: story.coverImageUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      };

      const baseFromStory = db.select({ total: count() }).from(story);
      const baseSelectStory = db.select(storyColumns).from(story);

      const countQuery = category
        ? baseFromStory.innerJoin(
            storyCategory,
            eq(story.categoryId, storyCategory.id),
          )
        : baseFromStory;
      const selectQuery = category
        ? baseSelectStory.innerJoin(
            storyCategory,
            eq(story.categoryId, storyCategory.id),
          )
        : baseSelectStory;

      const whereClause = filters.length > 0 ? and(...filters) : undefined;
      const [{ total }] = await countQuery.where(whereClause);
      const hasMore = page * limit < total;

      const stories = (await selectQuery
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
      ) as StoryRecord[];

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
        message: "Stories loaded successfully",
      });
    }),
  );

export const getStory = createServerFn({ method: "GET" })
  .inputValidator(getStorySchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<StoryRecord> => {
      const { storyId } = data;

      const rows = await db
        .select()
        .from(story)
        .where(eq(story.id, storyId))
        .limit(1);

      const row = rows[0];

      if (!row) {
        throw notFoundError("Story not found");
      }

      const storyRecord: StoryRecord = row as StoryRecord;

      return jsonOk({
        data: storyRecord,
        message: "Story loaded successfully",
      });
    }),
  );
