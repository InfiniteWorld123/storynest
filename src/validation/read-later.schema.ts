import { z } from 'zod'
import {
    idSchema,
    limitSchema,
    pageSchema,
    readLaterSortSchema,
} from '#/validation/shared.schema'

export const saveReadLaterSchema = z.object({
    storyId: idSchema,
})

export const removeReadLaterSchema = z.object({
    storyId: idSchema,
})

export const getReadLaterStoriesSchema = z.object({
    page: pageSchema,
    limit: limitSchema,
    sortBy: readLaterSortSchema.optional().default('newest'),
})

export const getReadLaterCountSchema = z.object({
    storyId: idSchema,
})

export type SaveReadLaterData = z.infer<typeof saveReadLaterSchema>
export type RemoveReadLaterData = z.infer<typeof removeReadLaterSchema>
export type GetReadLaterStoriesData = z.infer<typeof getReadLaterStoriesSchema>
export type GetReadLaterCountData = z.infer<typeof getReadLaterCountSchema>

export type GetReadLaterStoriesInput = z.input<typeof getReadLaterStoriesSchema>

// compatibility aliases
export type SaveReadLaterInput = SaveReadLaterData
export type RemoveReadLaterInput = RemoveReadLaterData
export type GetReadLaterCountInput = GetReadLaterCountData
