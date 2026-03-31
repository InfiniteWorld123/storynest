import { describe, expect, it } from "vitest";
import { storyContentSchema } from "#/validation/shared.schema";

describe("storyContentSchema", () => {
  it("accepts valid TipTap doc JSON", () => {
    const parsed = storyContentSchema.parse({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Chapter One" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "A beginning." }],
        },
      ],
    });

    expect(parsed.type).toBe("doc");
    expect(parsed.content).toHaveLength(2);
  });

  it("rejects non-doc roots", () => {
    const parsed = storyContentSchema.safeParse({
      type: "paragraph",
      content: [],
    });

    expect(parsed.success).toBe(false);
  });

  it("defaults empty content when omitted", () => {
    const parsed = storyContentSchema.parse({
      type: "doc",
    });

    expect(parsed.content).toEqual([]);
  });
});
