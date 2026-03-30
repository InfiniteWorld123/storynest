import { jsonOk } from '#/constants/json'
import { db } from '#/db/drizzle'
import { story } from '#/db/schema'
import { notFoundError } from '#/errors/app-error'
import { catchAsyncFn } from '#/errors/error-handler'
import type { ServerOk } from '#/server/_types'
import { getStorySchema } from '#/validation/story.schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

type StoryRecord = Omit<typeof story.$inferSelect, 'content'> & {
  content: Record<string, {}>
}

// Client-callable RPC wrapper for loading a story record.
export const getStoryRpc = createServerFn({ method: 'GET' })
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
