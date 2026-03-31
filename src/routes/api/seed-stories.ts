import { db } from '#/db/drizzle'
import { story, storyCategory, storyComment, storyReaction, storySave } from '#/db/schema'
import { env } from '#/constants/env'
import { auth } from '#/lib/auth.server'
import type { StoryContent } from '#/types/story'
import { createFileRoute } from '@tanstack/react-router'
import { and, count, eq } from 'drizzle-orm'

const DEFAULT_COUNT = 100
const MAX_COUNT = 300

const DEFAULT_CATEGORIES: Array<{ name: string; slug: string }> = [
  { name: 'Folklore', slug: 'folklore' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Myth', slug: 'myth' },
  { name: 'Travel', slug: 'travel' },
  { name: 'History', slug: 'history' },
]

const PLACES = [
  'Marrakesh',
  'Prague',
  'Kyoto',
  'Istanbul',
  'Lisbon',
  'Cairo',
  'Venice',
  'Edinburgh',
  'Samarkand',
  'Seville',
]

const ADJECTIVES = [
  'Silent',
  'Hidden',
  'Forgotten',
  'Golden',
  'Crimson',
  'Wandering',
  'Ancient',
  'Secret',
  'Last',
  'Midnight',
]

const NOUNS = [
  'Lantern',
  'Voyage',
  'Library',
  'Promise',
  'Harbor',
  'Garden',
  'Compass',
  'Chronicle',
  'Bridge',
  'Letter',
]

const OPENERS = [
  'The rain had just stopped when',
  'At the edge of dawn,',
  'Nobody in the village believed that',
  'On the oldest street in town,',
  'When the market bells rang,',
]

const CONFLICTS = [
  'a map appeared with no owner',
  'a sealed letter returned after twenty years',
  'a promise was broken at midnight',
  'a missing journal surfaced in the archives',
  'a stranger asked for an impossible favor',
]

const RESOLUTIONS = [
  'and a quiet truth changed everything.',
  'and the city remembered what it had buried.',
  'and the journey became larger than its destination.',
  'and the final page rewrote the beginning.',
  'and the answer was waiting at home all along.',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)] as T
}

function createTitle(): string {
  return `The ${pick(ADJECTIVES)} ${pick(NOUNS)} of ${pick(PLACES)}`
}

function createDescription(): string {
  return `${pick(OPENERS)} ${pick(CONFLICTS)}, ${pick(RESOLUTIONS)}`
}

function createParagraphs(count: number): string[] {
  return Array.from({ length: count }, () =>
    `${pick(OPENERS)} ${pick(CONFLICTS)}, ${pick(RESOLUTIONS)} ${pick(OPENERS)} ${pick(CONFLICTS)}, ${pick(RESOLUTIONS)}`,
  )
}

function createStoryContent(): StoryContent {
  const paragraphCount = randomInt(4, 8)
  const paragraphs = createParagraphs(paragraphCount)

  return {
    type: 'doc',
    content: paragraphs.map((text) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })),
  }
}

function createCoverImageUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`
}

async function ensureCategories(): Promise<Array<{ id: string; slug: string }>> {
  const existing = await db
    .select({ id: storyCategory.id, slug: storyCategory.slug })
    .from(storyCategory)

  if (existing.length > 0) {
    return existing
  }

  const categoryRows = DEFAULT_CATEGORIES.map((category) => ({
    id: crypto.randomUUID(),
    name: category.name,
    slug: category.slug,
  }))

  await db.insert(storyCategory).values(categoryRows)

  return categoryRows.map((category) => ({
    id: category.id,
    slug: category.slug,
  }))
}

async function getCurrentUserId(request: Request): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user.id ?? null
}

function getRequestedCount(request: Request): number {
  const url = new URL(request.url)
  const rawCount = Number(url.searchParams.get('count') || DEFAULT_COUNT)
  if (!Number.isFinite(rawCount) || rawCount <= 0) {
    return DEFAULT_COUNT
  }
  return Math.min(Math.floor(rawCount), MAX_COUNT)
}

async function seedStoriesForUser(userId: string, storyCount: number) {
  const categories = await ensureCategories()
  const storiesToCreate = Array.from({ length: storyCount }, (_, index) => {
    const selectedCategory = pick(categories)
    const title = createTitle()
    const seed = `${userId}-${Date.now()}-${index}-${title}`
    return {
      id: crypto.randomUUID(),
      userId,
      categoryId: selectedCategory.id,
      title,
      description: createDescription(),
      content: createStoryContent(),
      coverImageUrl: createCoverImageUrl(seed),
    }
  })

  await db.insert(story).values(storiesToCreate)

  const commentRows = storiesToCreate
    .filter(() => Math.random() > 0.25)
    .map((item) => ({
      id: crypto.randomUUID(),
      storyId: item.id,
      userId,
      content: createDescription(),
    }))

  if (commentRows.length > 0) {
    await db.insert(storyComment).values(commentRows)
  }

  const reactionRows = storiesToCreate
    .filter(() => Math.random() > 0.35)
    .map((item) => ({
      storyId: item.id,
      userId,
      reaction: Math.random() > 0.2 ? 'like' : 'dislike',
    })) as Array<{
      storyId: string
      userId: string
      reaction: 'like' | 'dislike'
    }>

  if (reactionRows.length > 0) {
    await db.insert(storyReaction).values(reactionRows)
  }

  const saveRows = storiesToCreate
    .filter(() => Math.random() > 0.5)
    .map((item) => ({
      storyId: item.id,
      userId,
    }))

  if (saveRows.length > 0) {
    await db.insert(storySave).values(saveRows)
  }

  const [createdStoriesCount] = await db
    .select({ total: count() })
    .from(story)
    .where(eq(story.userId, userId))

  const [savedStoriesCount] = await db
    .select({ total: count() })
    .from(storySave)
    .where(eq(storySave.userId, userId))

  const [likedStoriesCount] = await db
    .select({ total: count() })
    .from(storyReaction)
    .where(
      and(eq(storyReaction.userId, userId), eq(storyReaction.reaction, 'like')),
    )

  return {
    createdNow: storiesToCreate.length,
    commentsCreatedNow: commentRows.length,
    reactionsCreatedNow: reactionRows.length,
    savesCreatedNow: saveRows.length,
    totalsForUser: {
      stories: createdStoriesCount?.total ? Number(createdStoriesCount.total) : 0,
      saved: savedStoriesCount?.total ? Number(savedStoriesCount.total) : 0,
      likes: likedStoriesCount?.total ? Number(likedStoriesCount.total) : 0,
    },
  }
}

export const Route = createFileRoute('/api/seed-stories')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const seedEnabled = env.ENABLE_SEED_ROUTES || process.env.NODE_ENV !== 'production'
        if (!seedEnabled) {
          return Response.json(
            { success: false, message: 'Seed endpoint disabled in this environment.' },
            { status: 404 },
          )
        }

        const userId = await getCurrentUserId(request)
        if (!userId) {
          return Response.json(
            { success: false, message: 'Unauthorized. Sign in first.' },
            { status: 401 },
          )
        }

        const count = getRequestedCount(request)
        const result = await seedStoriesForUser(userId, count)

        return Response.json({
          success: true,
          message: `Seeded ${result.createdNow} stories for your account.`,
          ...result,
        })
      },
      POST: async ({ request }) => {
        const seedEnabled = env.ENABLE_SEED_ROUTES || process.env.NODE_ENV !== 'production'
        if (!seedEnabled) {
          return Response.json(
            { success: false, message: 'Seed endpoint disabled in this environment.' },
            { status: 404 },
          )
        }

        const userId = await getCurrentUserId(request)
        if (!userId) {
          return Response.json(
            { success: false, message: 'Unauthorized. Sign in first.' },
            { status: 401 },
          )
        }

        const count = getRequestedCount(request)
        const result = await seedStoriesForUser(userId, count)

        return Response.json({
          success: true,
          message: `Seeded ${result.createdNow} stories for your account.`,
          ...result,
        })
      },
    },
  },
})
