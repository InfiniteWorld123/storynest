import { z } from "zod";
import {
  coverImageUrlSchema,
  descriptionSchema,
  idSchema,
  limitSchema,
  pageSchema,
  storyContentSchema,
  storySortSchema,
  titleSchema,
} from "#/validation/shared.schema";

const STORY_CATEGORY_VALUES = [
  "folklore",
  "mystery",
  "romance",
  "myth",
  "travel",
  "history",
] as const;

export const storyCategorySlugs = STORY_CATEGORY_VALUES;

const storyCategoryEnum = z.enum(STORY_CATEGORY_VALUES);
export const StoryContentSchema = storyContentSchema;

export const createStorySchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  categoryId: storyCategoryEnum,
  content: StoryContentSchema,
  coverImageUrl: coverImageUrlSchema,
});

export const getStorySchema = z.object({
  storyId: idSchema,
});

export const getStoriesSchema = z.object({
  category: storyCategoryEnum.optional(),
  title: z.string().optional(),
  sort: storySortSchema.optional().default("newest"),
  page: pageSchema,
  limit: limitSchema,
});

export const updateStorySchema = z
  .object({
    storyId: idSchema,
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    categoryId: storyCategoryEnum.optional(),
    content: StoryContentSchema.optional(),
    coverImageUrl: coverImageUrlSchema,
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.categoryId !== undefined ||
      data.content !== undefined ||
      data.coverImageUrl !== undefined,
    {
      message: "At least one field is required to update a story",
    },
  );

export const deleteStorySchema = z.object({
  storyId: idSchema,
});

export type CreateStoryData = z.infer<typeof createStorySchema>;
export type UpdateStoryData = z.infer<typeof updateStorySchema>;
export type GetStoriesData = z.infer<typeof getStoriesSchema>;
export type GetStoryData = z.infer<typeof getStorySchema>;
export type DeleteStoryData = z.infer<typeof deleteStorySchema>;

export type GetStoriesInput = z.input<typeof getStoriesSchema>;

// compatibility aliases
export type StoryFormValues = CreateStoryData;
export type StoryUpdateValues = UpdateStoryData;
export type GetStoriesParams = GetStoriesData;
