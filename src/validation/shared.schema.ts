import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const idSchema = z.string().min(1, 'Id is required')

export const pageSchema = z.number().int().positive().default(1)
export const limitSchema = z.number().int().positive().max(100).default(10)

export const titleSchema = z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be 200 characters or fewer')
    .trim()

export const descriptionSchema = z
    .string()
    .min(20, 'Description must be at least 20 characters long')
    .max(1000, 'Description must be 1000 characters or fewer')
    .trim()

export const slugSchema = z
    .string()
    .min(2, 'Category slug must be at least 2 characters')
    .max(80, 'Category slug is too long')
    .regex(slugRegex, 'Category slug must use lowercase letters, numbers, and hyphens')
    .trim()

export const commentContentSchema = z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be 1000 characters or fewer')
    .trim()

export const coverImageUrlSchema = z
    .string()
    .url('Cover image must be a valid URL')
    .optional()

const storyMarkSchema = z.object({
    type: z.string().min(1),
    attrs: z.record(z.string(), z.any()).optional(),
})

type StoryNode = {
    type: string
    text?: string
    attrs?: Record<string, {}>
    marks?: Array<{ type: string; attrs?: Record<string, {}> }>
    content?: StoryNode[]
}

const storyNodeSchema: z.ZodType<StoryNode> = z.lazy(() =>
    z.object({
        type: z.string().min(1),
        text: z.string().optional(),
        attrs: z.record(z.string(), z.any()).optional(),
        marks: z.array(storyMarkSchema).optional(),
        content: z.array(storyNodeSchema).optional(),
    }),
)

export const storyContentSchema = z.object({
    type: z.literal('doc'),
    content: z.array(storyNodeSchema).default([]),
})

export const BASE_SORT_VALUES = [
    'newest',
    'oldest',
    'az',
    'za',
] as const

export const CHRONO_SORT_VALUES = [
    'newest',
    'oldest',
] as const

export const baseSortSchema = z.enum(BASE_SORT_VALUES)
export const storySortSchema = baseSortSchema
export const commentSortSchema = baseSortSchema
export const readLaterSortSchema = z.enum(CHRONO_SORT_VALUES)
