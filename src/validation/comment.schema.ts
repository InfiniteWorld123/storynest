import { z } from 'zod'
import {
    commentContentSchema,
    commentSortSchema,
    idSchema,
    limitSchema,
    pageSchema,
} from '#/validation/shared.schema'

export const createCommentSchema = z.object({
    storyId: idSchema,
    content: commentContentSchema,
})

export const updateCommentSchema = z.object({
    commentId: idSchema,
    content: commentContentSchema,
})

export const deleteCommentSchema = z.object({
    commentId: idSchema,
})

export const getCommentsSchema = z.object({
    storyId: idSchema,
    sortBy: commentSortSchema.optional().default('newest'),
    page: pageSchema,
    limit: limitSchema,
})

export type CreateCommentData = z.infer<typeof createCommentSchema>
export type UpdateCommentData = z.infer<typeof updateCommentSchema>
export type DeleteCommentData = z.infer<typeof deleteCommentSchema>
export type GetCommentsData = z.infer<typeof getCommentsSchema>

export type GetCommentsInput = z.input<typeof getCommentsSchema>

// compatibility aliases
export type CreateCommentInput = CreateCommentData
export type UpdateCommentInput = UpdateCommentData
export type DeleteCommentInput = DeleteCommentData
