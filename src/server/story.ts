import { HttpStatusCode } from '#/constants/http'
import { jsonOk } from '#/constants/json'
import { db } from '#/db/drizzle'
import { story, storyCategory, storyComment, storyReaction, storySave } from '#/db/schema'
import { conflictError, notFoundError } from '#/errors/app-error'
import { catchAsyncFn } from '#/errors/error-handler'
import { authMiddleware } from '#/middleware/auth.middleware'
import type { PaginatedResource } from '#/server/api.types'
import type { ServerOk } from '#/server/_types'
import {
  createStorySchema,
  deleteStorySchema,
  getOverviewStatsSchema,
  getStoriesSchema,
  getStorySchema,
  updateStorySchema,
} from '#/validation/story.schema'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, asc, count, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { StoryContent } from '#/types/story'

type StoryMutationResult = {
  id: string
}

export type StoryRecord = Omit<typeof story.$inferSelect, 'content'> & {
  content: StoryContent
}

type StoryStatsPayload = {
  likes: number
  dislikes: number
  comments: number
  saves: number
  myReaction: typeof storyReaction.$inferSelect['reaction'] | null
  isSaved: boolean
}

export type PaginatedStories = PaginatedResource<'stories', StoryRecord>
export type PublicStoryRecord = StoryRecord & {
  category: {
    id: string
    name: string
    slug: string
  }
  stats: StoryStatsPayload
}
export type PaginatedPublicStories = PaginatedResource<'stories', PublicStoryRecord>
export type StoryWithCategory = StoryRecord & {
  category: {
    id: string
    name: string
    slug: string
  }
  stats: StoryStatsPayload
}

type StoryWithStats = StoryRecord & {
  category: {
    id: string
    name: string
    slug: string
  }
  stats: {
    likes: number
    dislikes: number
    comments: number
    saves: number
    myReaction: typeof storyReaction.$inferSelect['reaction'] | null
    isSaved: boolean
  }
}

export type PaginatedStoriesWithStats = PaginatedResource<'stories', StoryWithStats>

type StoryStatsMaps = {
  likesByStory: Map<string, number>
  dislikesByStory: Map<string, number>
  commentsByStory: Map<string, number>
  savesByStory: Map<string, number>
  myReactionByStory: Map<string, typeof storyReaction.$inferSelect['reaction']>
  mySavedStoryIds: Set<string>
}

async function getOptionalViewerUserId() {
  try {
    const { auth } = await import('#/lib/auth.server')
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session?.user.id ?? null
  } catch {
    return null
  }
}

async function getStoryStatsMaps(storyIds: string[], viewerUserId: string | null): Promise<StoryStatsMaps> {
  const likesByStory = new Map<string, number>()
  const dislikesByStory = new Map<string, number>()
  const commentsByStory = new Map<string, number>()
  const savesByStory = new Map<string, number>()
  const myReactionByStory = new Map<string, typeof storyReaction.$inferSelect['reaction']>()
  const mySavedStoryIds = new Set<string>()

  if (storyIds.length === 0) {
    return {
      likesByStory,
      dislikesByStory,
      commentsByStory,
      savesByStory,
      myReactionByStory,
      mySavedStoryIds,
    }
  }

  const reactionRows = await db
    .select({
      storyId: storyReaction.storyId,
      reaction: storyReaction.reaction,
      total: count(),
    })
    .from(storyReaction)
    .where(inArray(storyReaction.storyId, storyIds))
    .groupBy(storyReaction.storyId, storyReaction.reaction)

  reactionRows.forEach((row) => {
    const nextCount = Number(row.total)
    if (row.reaction === 'like') {
      likesByStory.set(row.storyId, nextCount)
    } else {
      dislikesByStory.set(row.storyId, nextCount)
    }
  })

  const commentRows = await db
    .select({
      storyId: storyComment.storyId,
      total: count(),
    })
    .from(storyComment)
    .where(inArray(storyComment.storyId, storyIds))
    .groupBy(storyComment.storyId)

  commentRows.forEach((row) => {
    commentsByStory.set(row.storyId, Number(row.total))
  })

  const saveRows = await db
    .select({
      storyId: storySave.storyId,
      total: count(),
    })
    .from(storySave)
    .where(inArray(storySave.storyId, storyIds))
    .groupBy(storySave.storyId)

  saveRows.forEach((row) => {
    savesByStory.set(row.storyId, Number(row.total))
  })

  if (viewerUserId) {
    const myReactionRows = await db
      .select({
        storyId: storyReaction.storyId,
        reaction: storyReaction.reaction,
      })
      .from(storyReaction)
      .where(
        and(
          inArray(storyReaction.storyId, storyIds),
          eq(storyReaction.userId, viewerUserId),
        ),
      )

    myReactionRows.forEach((row) => {
      myReactionByStory.set(row.storyId, row.reaction)
    })

    const mySaveRows = await db
      .select({
        storyId: storySave.storyId,
      })
      .from(storySave)
      .where(
        and(
          inArray(storySave.storyId, storyIds),
          eq(storySave.userId, viewerUserId),
        ),
      )

    mySaveRows.forEach((row) => {
      mySavedStoryIds.add(row.storyId)
    })
  }

  return {
    likesByStory,
    dislikesByStory,
    commentsByStory,
    savesByStory,
    myReactionByStory,
    mySavedStoryIds,
  }
}

function resolveStoryStats(storyId: string, maps: StoryStatsMaps): StoryStatsPayload {
  return {
    likes: maps.likesByStory.get(storyId) ?? 0,
    dislikes: maps.dislikesByStory.get(storyId) ?? 0,
    comments: maps.commentsByStory.get(storyId) ?? 0,
    saves: maps.savesByStory.get(storyId) ?? 0,
    myReaction: maps.myReactionByStory.get(storyId) ?? null,
    isSaved: maps.mySavedStoryIds.has(storyId),
  }
}

type OverviewBestStory = {
  storyId: string
  title: string
  count: number
}

export type UserOverviewStats = {
  totals: {
    storiesWritten: number
    savedForLater: number
    categoriesUsed: number
    reactionsReceived: number
    commentsReceived: number
    timesSaved: number
  }
  bestPerforming: {
    mostLiked: OverviewBestStory | null
    mostCommented: OverviewBestStory | null
    mostSaved: OverviewBestStory | null
  }
  recentStories: Array<{
    id: string
    title: string
    description: string
    createdAt: Date
    updatedAt: Date
    category: {
      id: string
      name: string
      slug: string
    }
  }>
}

export const createStory = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(createStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context
      const { title, description, categoryId, content, coverImageUrl } = data
      const storyId = crypto.randomUUID()

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.userId, session.user.id), eq(story.title, title)))
        .limit(1)

      if (existingStories[0]) {
        throw conflictError('Story already exists')
      }

      await db.insert(story).values({
        id: storyId,
        userId: session.user.id,
        categoryId,
        title,
        description,
        content,
        coverImageUrl: coverImageUrl || null,
      })

      return jsonOk({
        data: { id: storyId },
        status: HttpStatusCode.CREATED,
        message: 'Story created successfully',
      })
    }),
  )

export const updateStory = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(updateStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context
      const { storyId, title, description, categoryId, content, coverImageUrl } = data

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))
        .limit(1)

      const existing = existingStories[0]

      if (!existing) {
        throw notFoundError('Story not found')
      }

      const updatedData = {
        title: title ?? existing.title,
        description: description ?? existing.description,
        categoryId: categoryId ?? existing.categoryId,
        content: content ?? existing.content,
        coverImageUrl:
          coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
      }

      await db
        .update(story)
        .set(updatedData)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))

      return jsonOk({
        data: { id: storyId },
        message: 'Story updated successfully',
      })
    }),
  )

export const deleteStory = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(deleteStorySchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<StoryMutationResult> => {
      const { session } = context
      const { storyId } = data

      const existingStories = await db
        .select()
        .from(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))
        .limit(1)

      if (!existingStories[0]) {
        throw notFoundError('Story not found')
      }

      await db
        .delete(story)
        .where(and(eq(story.id, storyId), eq(story.userId, session.user.id)))

      return jsonOk({
        data: { id: storyId },
        message: 'Story deleted successfully',
      })
    }),
  )

export const getUserStories = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(getStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<PaginatedStories> => {
      const { session } = context
      const { page, limit, category, search, sort } = data
      const offset = (page - 1) * limit
      const filters = [eq(story.userId, session.user.id)]

      if (category) {
        filters.push(eq(storyCategory.slug, category))
      }
      if (search?.trim()) {
        filters.push(ilike(story.title, `%${search.trim()}%`))
      }

      const orderBy =
        sort === 'oldest'
          ? asc(story.createdAt)
          : sort === 'az'
            ? asc(story.title)
            : sort === 'za'
              ? desc(story.title)
              : desc(story.createdAt)

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
      }

      const baseFromStory = db.select({ total: count() }).from(story)
      const baseSelectStory = db.select(storyColumns).from(story)

      const countQuery = category
        ? baseFromStory.innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        : baseFromStory
      const selectQuery = category
        ? baseSelectStory.innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        : baseSelectStory

      const [{ total }] = await countQuery.where(and(...filters))
      const hasMore = page * limit < total

      const stories = (await selectQuery
        .where(and(...filters))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)) as StoryRecord[]

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
        message: 'Stories loaded successfully',
      })
    }),
  )

export const getUserStoriesWithStats = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(getStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<PaginatedStoriesWithStats> => {
      const { session } = context
      const { page, limit, category, search, sort } = data
      const offset = (page - 1) * limit
      const filters = [eq(story.userId, session.user.id)]

      if (category) {
        filters.push(eq(storyCategory.slug, category))
      }
      if (search?.trim()) {
        filters.push(ilike(story.title, `%${search.trim()}%`))
      }

      const orderBy =
        sort === 'oldest'
          ? asc(story.createdAt)
          : sort === 'az'
            ? asc(story.title)
            : sort === 'za'
              ? desc(story.title)
              : desc(story.createdAt)

      const [{ total }] = await db
        .select({ total: count() })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(and(...filters))

      const hasMore = page * limit < total
      const baseStories = await db
        .select({
          id: story.id,
          userId: story.userId,
          categoryId: story.categoryId,
          title: story.title,
          description: story.description,
          content: story.content,
          coverImageUrl: story.coverImageUrl,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          category: {
            id: storyCategory.id,
            name: storyCategory.name,
            slug: storyCategory.slug,
          },
        })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(and(...filters))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)

      const storyIds = baseStories.map((row) => row.id)
      const likesByStory = new Map<string, number>()
      const dislikesByStory = new Map<string, number>()
      const commentsByStory = new Map<string, number>()
      const savesByStory = new Map<string, number>()
      const myReactionByStory = new Map<string, typeof storyReaction.$inferSelect['reaction']>()
      const mySavedStoryIds = new Set<string>()

      if (storyIds.length > 0) {
        const reactionRows = await db
          .select({
            storyId: storyReaction.storyId,
            reaction: storyReaction.reaction,
            total: count(),
          })
          .from(storyReaction)
          .where(inArray(storyReaction.storyId, storyIds))
          .groupBy(storyReaction.storyId, storyReaction.reaction)

        reactionRows.forEach((row) => {
          const nextCount = Number(row.total)
          if (row.reaction === 'like') {
            likesByStory.set(row.storyId, nextCount)
          } else {
            dislikesByStory.set(row.storyId, nextCount)
          }
        })

        const commentRows = await db
          .select({
            storyId: storyComment.storyId,
            total: count(),
          })
          .from(storyComment)
          .where(inArray(storyComment.storyId, storyIds))
          .groupBy(storyComment.storyId)

        commentRows.forEach((row) => {
          commentsByStory.set(row.storyId, Number(row.total))
        })

        const saveRows = await db
          .select({
            storyId: storySave.storyId,
            total: count(),
          })
          .from(storySave)
          .where(inArray(storySave.storyId, storyIds))
          .groupBy(storySave.storyId)

        saveRows.forEach((row) => {
          savesByStory.set(row.storyId, Number(row.total))
        })

        const myReactionRows = await db
          .select({
            storyId: storyReaction.storyId,
            reaction: storyReaction.reaction,
          })
          .from(storyReaction)
          .where(
            and(
              inArray(storyReaction.storyId, storyIds),
              eq(storyReaction.userId, session.user.id),
            ),
          )

        myReactionRows.forEach((row) => {
          myReactionByStory.set(row.storyId, row.reaction)
        })

        const mySaveRows = await db
          .select({
            storyId: storySave.storyId,
          })
          .from(storySave)
          .where(
            and(
              inArray(storySave.storyId, storyIds),
              eq(storySave.userId, session.user.id),
            ),
          )

        mySaveRows.forEach((row) => {
          mySavedStoryIds.add(row.storyId)
        })
      }

      const stories: StoryWithStats[] = baseStories.map((row) => ({
        id: row.id,
        userId: row.userId,
        categoryId: row.categoryId,
        title: row.title,
        description: row.description,
        content: row.content as StoryContent,
        coverImageUrl: row.coverImageUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        category: row.category,
        stats: {
          likes: likesByStory.get(row.id) ?? 0,
          dislikes: dislikesByStory.get(row.id) ?? 0,
          comments: commentsByStory.get(row.id) ?? 0,
          saves: savesByStory.get(row.id) ?? 0,
          myReaction: myReactionByStory.get(row.id) ?? null,
          isSaved: mySavedStoryIds.has(row.id),
        },
      }))

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
        message: 'Stories with stats loaded successfully',
      })
    }),
  )

export const getUserOverviewStats = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(getOverviewStatsSchema)
  .handler(
    catchAsyncFn(async ({ data, context }): ServerOk<UserOverviewStats> => {
      const { session } = context
      const { recentLimit } = data

      const [{ storiesWritten }] = await db
        .select({ storiesWritten: count() })
        .from(story)
        .where(eq(story.userId, session.user.id))

      const [{ savedForLater }] = await db
        .select({ savedForLater: count() })
        .from(storySave)
        .where(eq(storySave.userId, session.user.id))

      const categoryRows = await db
        .select({ categoryId: story.categoryId })
        .from(story)
        .where(eq(story.userId, session.user.id))
        .groupBy(story.categoryId)

      const storiesLookup = await db
        .select({
          id: story.id,
          title: story.title,
        })
        .from(story)
        .where(eq(story.userId, session.user.id))
      const storyTitleById = new Map(storiesLookup.map((row) => [row.id, row.title]))

      const reactionRows = await db
        .select({
          storyId: storyReaction.storyId,
          reaction: storyReaction.reaction,
          total: count(),
        })
        .from(storyReaction)
        .innerJoin(story, eq(storyReaction.storyId, story.id))
        .where(eq(story.userId, session.user.id))
        .groupBy(storyReaction.storyId, storyReaction.reaction)

      const commentRows = await db
        .select({
          storyId: storyComment.storyId,
          total: count(),
        })
        .from(storyComment)
        .innerJoin(story, eq(storyComment.storyId, story.id))
        .where(eq(story.userId, session.user.id))
        .groupBy(storyComment.storyId)

      const saveRows = await db
        .select({
          storyId: storySave.storyId,
          total: count(),
        })
        .from(storySave)
        .innerJoin(story, eq(storySave.storyId, story.id))
        .where(eq(story.userId, session.user.id))
        .groupBy(storySave.storyId)

      const reactionsReceived = reactionRows.reduce((sum, row) => sum + Number(row.total), 0)
      const commentsReceived = commentRows.reduce((sum, row) => sum + Number(row.total), 0)
      const timesSaved = saveRows.reduce((sum, row) => sum + Number(row.total), 0)

      const likeCounts = new Map<string, number>()
      reactionRows.forEach((row) => {
        if (row.reaction === 'like') {
          likeCounts.set(row.storyId, Number(row.total))
        }
      })

      const commentCounts = new Map(commentRows.map((row) => [row.storyId, Number(row.total)]))
      const saveCounts = new Map(saveRows.map((row) => [row.storyId, Number(row.total)]))

      const pickTopStory = (counts: Map<string, number>): OverviewBestStory | null => {
        let topStory: OverviewBestStory | null = null

        counts.forEach((value, storyId) => {
          if (value <= 0) {
            return
          }

          if (!topStory || value > topStory.count) {
            const title = storyTitleById.get(storyId)
            if (title) {
              topStory = {
                storyId,
                title,
                count: value,
              }
            }
          }
        })

        return topStory
      }

      const recentStoriesRows = await db
        .select({
          id: story.id,
          title: story.title,
          description: story.description,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          category: {
            id: storyCategory.id,
            name: storyCategory.name,
            slug: storyCategory.slug,
          },
        })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(eq(story.userId, session.user.id))
        .orderBy(desc(story.createdAt))
        .limit(recentLimit)

      return jsonOk({
        data: {
          totals: {
            storiesWritten: Number(storiesWritten),
            savedForLater: Number(savedForLater),
            categoriesUsed: categoryRows.length,
            reactionsReceived,
            commentsReceived,
            timesSaved,
          },
          bestPerforming: {
            mostLiked: pickTopStory(likeCounts),
            mostCommented: pickTopStory(commentCounts),
            mostSaved: pickTopStory(saveCounts),
          },
          recentStories: recentStoriesRows,
        },
        message: 'Overview stats loaded successfully',
      })
    }),
  )

export const getStories = createServerFn({ method: 'GET' })
  .inputValidator(getStoriesSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<PaginatedPublicStories> => {
      const { page, limit, category, search, sort } = data
      const viewerUserId = await getOptionalViewerUserId()
      const offset = (page - 1) * limit
      const filters: ReturnType<typeof eq>[] = []

      if (category) {
        filters.push(eq(storyCategory.slug, category))
      }
      if (search?.trim()) {
        filters.push(ilike(story.title, `%${search.trim()}%`))
      }

      const orderBy =
        sort === 'oldest'
          ? asc(story.createdAt)
          : sort === 'az'
            ? asc(story.title)
            : sort === 'za'
              ? desc(story.title)
              : desc(story.createdAt)

      const whereClause = filters.length > 0 ? and(...filters) : undefined
      const [{ total }] = await db
        .select({ total: count() })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(whereClause)
      const hasMore = page * limit < total

      const stories = (await db
        .select({
          id: story.id,
          userId: story.userId,
          categoryId: story.categoryId,
          title: story.title,
          description: story.description,
          content: story.content,
          coverImageUrl: story.coverImageUrl,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          category: {
            id: storyCategory.id,
            name: storyCategory.name,
            slug: storyCategory.slug,
          },
        })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)) as Array<Omit<PublicStoryRecord, 'stats'>>

      const storyIds = stories.map((row) => row.id)
      const statsMaps = await getStoryStatsMaps(storyIds, viewerUserId)
      const storiesWithStats: PublicStoryRecord[] = stories.map((row) => ({
        ...row,
        content: row.content as StoryContent,
        stats: resolveStoryStats(row.id, statsMaps),
      }))

      return jsonOk({
        data: {
          stories: storiesWithStats,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore,
          },
        },
        message: 'Stories loaded successfully',
      })
    }),
  )

export const getStory = createServerFn({ method: 'GET' })
  .inputValidator(getStorySchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<StoryRecord> => {
      const { storyId } = data

      const rows = await db
        .select()
        .from(story)
        .where(eq(story.id, storyId))
        .limit(1)

      const row = rows[0]

      if (!row) {
        throw notFoundError('Story not found')
      }

      return jsonOk({
        data: row as StoryRecord,
        message: 'Story loaded successfully',
      })
    }),
  )

export const getStoryWithCategory = createServerFn({ method: 'GET' })
  .inputValidator(getStorySchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<StoryWithCategory> => {
      const { storyId } = data
      const viewerUserId = await getOptionalViewerUserId()

      const rows = await db
        .select({
          id: story.id,
          userId: story.userId,
          categoryId: story.categoryId,
          title: story.title,
          description: story.description,
          content: story.content,
          coverImageUrl: story.coverImageUrl,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          category: {
            id: storyCategory.id,
            name: storyCategory.name,
            slug: storyCategory.slug,
          },
        })
        .from(story)
        .innerJoin(storyCategory, eq(story.categoryId, storyCategory.id))
        .where(eq(story.id, storyId))
        .limit(1)

      const row = rows[0]

      if (!row) {
        throw notFoundError('Story not found')
      }

      const statsMaps = await getStoryStatsMaps([row.id], viewerUserId)

      return jsonOk({
        data: {
          ...row,
          content: row.content as StoryContent,
          stats: resolveStoryStats(row.id, statsMaps),
        },
        message: 'Story loaded successfully',
      })
    }),
  )
