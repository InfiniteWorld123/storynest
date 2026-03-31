import { describe, expect, it } from "vitest";
import { contactSchema } from "#/validation/contact.schema";

describe("contactSchema", () => {
  it("normalizes and validates a valid contact payload", () => {
    const parsed = contactSchema.parse({
      name: "  Alex Writer  ",
      email: "  ALEX@EXAMPLE.COM  ",
      subject: "  Partnership Inquiry  ",
      message: "  I would love to discuss a collaboration for StoryNest.  ",
      honeypot: "",
      formStartedAt: Date.now() - 10_000,
    });

    expect(parsed.name).toBe("Alex Writer");
    expect(parsed.email).toBe("alex@example.com");
    expect(parsed.subject).toBe("Partnership Inquiry");
  });

  it("rejects honeypot submissions", () => {
    const parsed = contactSchema.safeParse({
      name: "Alex Writer",
      email: "alex@example.com",
      subject: "Hello",
      message: "This is a valid message body with enough content.",
      honeypot: "bot-filled",
      formStartedAt: Date.now(),
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects too-short messages", () => {
    const parsed = contactSchema.safeParse({
      name: "Alex Writer",
      email: "alex@example.com",
      subject: "Hello",
      message: "Too short",
      honeypot: "",
      formStartedAt: Date.now(),
    });

    expect(parsed.success).toBe(false);
  });
});
