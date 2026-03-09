import { z } from 'zod'
import { idSchema } from '#/validation/shared.schema'

const reactionTypeValues = ['like', 'dislike'] as const

export const reactionTypeSchema = z.enum(reactionTypeValues)

export const toggleReactionSchema = z.object({
    storyId: idSchema,
    reaction: reactionTypeSchema,
})

export const getReactionsCountSchema = z.object({
    storyId: idSchema,
})

export type ToggleReactionData = z.infer<typeof toggleReactionSchema>
export type GetReactionsCountData = z.infer<typeof getReactionsCountSchema>

// compatibility aliases
export type ToggleReactionInput = ToggleReactionData
export type GetReactionsCountInput = GetReactionsCountData
