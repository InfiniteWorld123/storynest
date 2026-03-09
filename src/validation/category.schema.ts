import { z } from 'zod'
import { slugSchema } from '#/validation/shared.schema'

export const createCategorySchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').max(60, 'Category name is too long').trim(),
    slug: slugSchema,
})

export type CreateCategoryData = z.infer<typeof createCategorySchema>

// compatibility aliases
export type CreateCategoryInput = CreateCategoryData
