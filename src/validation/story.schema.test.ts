import { describe, expect, it } from "vitest";
import {
  createStorySchema,
  getStoriesSchema,
  updateStorySchema,
} from "#/validation/story.schema";

const validContent = {
  type: "doc" as const,
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Once upon a time..." }],
    },
  ],
};

describe("story schema contracts", () => {
  it("accepts create payloads with categoryId values", () => {
    const parsed = createStorySchema.parse({
      title: "A Story Worth Reading",
      description: "This description is long enough to satisfy schema requirements.",
      categoryId: "cat_01JZK1DV31PQ8JJJ6M8G4H3T7X",
      content: validContent,
      coverImageUrl: "https://example.com/cover.jpg",
    });

    expect(parsed.categoryId).toBe("cat_01JZK1DV31PQ8JJJ6M8G4H3T7X");
  });

  it("keeps public category filters slug-based", () => {
    const parsed = getStoriesSchema.parse({
      category: "folklore",
      search: "lantern",
      page: 1,
      limit: 10,
    });

    expect(parsed.category).toBe("folklore");
  });

  it("rejects invalid public category filters", () => {
    const parsed = getStoriesSchema.safeParse({
      category: "unknown-slug",
      page: 1,
      limit: 10,
    });

    expect(parsed.success).toBe(false);
  });

  it("requires at least one mutable field for updates", () => {
    const parsed = updateStorySchema.safeParse({
      storyId: "story_123",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "At least one field is required to update a story",
      );
    }
  });
});
