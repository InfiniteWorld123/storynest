// ─── Single source of truth for all static story mock data ───────────────────
// Shapes match the real backend API exactly — swap these imports for real
// server function calls when wiring up.

export type Story = {
  id: string
  title: string
  description: string
  content: StoryContent
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
  category: { id: string; name: string; slug: string }
}

export type StoryContent = {
  type: 'doc'
  content: Array<{
    type: string
    content?: Array<{ type: string; text?: string; marks?: Array<{ type: string }> }>
    attrs?: Record<string, unknown>
  }>
}

export type StoryComment = {
  id: string
  storyId: string
  userId: string
  authorName: string
  content: string
  createdAt: string
  updatedAt: string
}

export type StoryEngagement = {
  likes: number
  dislikes: number
  comments: number
  saves: number
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Fog of Innisfree',
    description:
      'A wandering monk discovers a village frozen in time, where every face belongs to someone he has loved and lost.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The fog arrived before the monk did. It came in low over the hills, swallowing the road behind him as if erasing the very path he had walked. Brother Ciarán pulled his robe tighter and pressed on.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The village of Innisfree appeared as a smear of amber light in the grey — lanterns burning in windows, smoke curling from chimneys. A place untouched by the century, or any century.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'The First Face' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'He saw her at the well. His mother. Thirty years younger than when she had died, drawing water with the easy grace he remembered from boyhood. He opened his mouth. No sound came.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The village did not speak of the fog. They did not speak of time. They offered him bread and a fire and asked nothing of where he came from. He stayed the night, meaning to leave at dawn.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'That was forty years ago. The fog has never lifted. And every face in Innisfree belongs to someone he has loved and lost — which means, he has finally understood, that this village was built for him alone.',
            },
          ],
        },
      ],
    },
    coverImageUrl: null,
    createdAt: '2025-11-14T10:00:00Z',
    updatedAt: '2025-11-14T10:00:00Z',
    category: { id: '1', name: 'Folklore', slug: 'folklore' },
  },
  {
    id: '2',
    title: 'Letters Never Sent',
    description:
      "A decades-long correspondence between two strangers who never meet, yet shape each other's entire lives.",
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The first letter was a mistake. Mireille had meant to write to her sister in Lyon, but the address slipped — a transposition of two numbers — and the envelope crossed half of France to land in the letterbox of a man named Henri Voss.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'He wrote back. He should not have. He knew it was not meant for him. But the loneliness of that winter was particular and sharp, and her words had been warm.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Thirty-Seven Years' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'They wrote for thirty-seven years. Through marriages to other people, through children and bereavements, through the slow erosion of certainty that comes with age. They never arranged to meet.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The letters are in a shoebox now. Mireille's daughter found them after the funeral, tied in packets by year, all addressed to a name she did not recognise.",
            },
          ],
        },
      ],
    },
    coverImageUrl: null,
    createdAt: '2025-12-01T14:30:00Z',
    updatedAt: '2025-12-03T09:00:00Z',
    category: { id: '2', name: 'Romance', slug: 'romance' },
  },
  {
    id: '3',
    title: "The Cartographer's Ghost",
    description:
      "When a mapmaker begins charting places that don't exist, the cities start appearing — one by one.",
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Elsa Vane had been drawing maps for twenty years when the errors began. Small at first — a river that bent the wrong way, a mountain range shifted a degree east. She corrected them and moved on.",
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Then she drew a city that didn't exist. A city with three harbours and a clock tower that faced the sea. She published the map, expecting complaints.",
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'The First Report' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A sailor wrote to her six months later. He had found the city. Three harbours. A clock tower facing the sea. The locals said it had been there for centuries.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Elsa drew more cities. Forests. A desert that shouldn't exist at that latitude. She stopped publishing. She drew only for herself now, in the dark, watching what she invented become real.",
            },
          ],
        },
      ],
    },
    coverImageUrl: null,
    createdAt: '2026-01-08T08:45:00Z',
    updatedAt: '2026-01-08T08:45:00Z',
    category: { id: '3', name: 'Mystery', slug: 'mystery' },
  },
  {
    id: '4',
    title: 'Salt and Old Gods',
    description:
      'A fishing village bargains with a sea deity for calm waters, not knowing what the ancient pact truly demands.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The village of Saltmere had not lost a boat in forty years. The fishermen knew why. Their grandfathers had made the bargain — a bowl of salt at the tide's edge every new moon, and the god of the deep water would sleep.",
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Ona was seventeen when she forgot the offering. A Tuesday in February, the moon hidden by cloud, her mind on other things. She remembered by Thursday.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'What the God Asked' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The god did not take a boat. It came to Ona instead, wearing the shape of water, and explained what the bargain had always really been. The salt was not for sleeping. The salt was for waking — slowly, carefully, one grain at a time.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The village still leaves the bowl at the tide. But Ona leaves hers slightly different now — more salt, a longer pour. She is not sure what she is doing. She does it anyway.',
            },
          ],
        },
      ],
    },
    coverImageUrl: null,
    createdAt: '2026-02-20T16:00:00Z',
    updatedAt: '2026-02-22T11:00:00Z',
    category: { id: '4', name: 'Myth', slug: 'myth' },
  },
]

// ─── Comments (keyed by storyId) ─────────────────────────────────────────────

export const MOCK_COMMENTS: StoryComment[] = [
  {
    id: 'c1',
    storyId: '1',
    userId: 'u2',
    authorName: 'Margot Wells',
    content:
      'This made me think of my grandmother immediately. The image of him recognising his mother at the well is devastating. Beautiful writing.',
    createdAt: '2025-11-20T14:22:00Z',
    updatedAt: '2025-11-20T14:22:00Z',
  },
  {
    id: 'c2',
    storyId: '1',
    userId: 'u3',
    authorName: 'Tomás Rua',
    content:
      'The ending landed so quietly. "This village was built for him alone." I had to stop and sit with that for a while.',
    createdAt: '2025-12-02T09:11:00Z',
    updatedAt: '2025-12-02T09:11:00Z',
  },
  {
    id: 'c3',
    storyId: '2',
    userId: 'u4',
    authorName: 'Priya Nair',
    content:
      "Thirty-seven years. I can't get over that number. And yet it feels completely believable — the kind of relationship that can only exist in letters.",
    createdAt: '2025-12-10T17:45:00Z',
    updatedAt: '2025-12-10T17:45:00Z',
  },
  {
    id: 'c4',
    storyId: '2',
    userId: 'u5',
    authorName: 'Luís Carvalho',
    content:
      "The shoebox detail at the end is perfect. It brings everything back to something physical, something you could hold.",
    createdAt: '2025-12-18T11:30:00Z',
    updatedAt: '2025-12-18T11:30:00Z',
  },
  {
    id: 'c5',
    storyId: '2',
    userId: 'u6',
    authorName: 'Saoirse Flynn',
    content:
      "I've read this three times now. The restraint is extraordinary — we never find out if they loved each other and somehow that makes it more true.",
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'c6',
    storyId: '3',
    userId: 'u7',
    authorName: 'Khalid Hassan',
    content:
      'The moment the sailor writes back — that is the hinge on which the whole story turns. Brilliantly constructed.',
    createdAt: '2026-01-15T19:20:00Z',
    updatedAt: '2026-01-15T19:20:00Z',
  },
  {
    id: 'c7',
    storyId: '4',
    userId: 'u8',
    authorName: 'Brigid Ó Máille',
    content:
      "Salt as a metaphor for gradual awakening — I didn't see that coming. This deserves a much longer treatment.",
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
]

// ─── Engagement data (simulates per-story API calls) ─────────────────────────

export const MOCK_ENGAGEMENT: Record<string, StoryEngagement> = {
  '1': { likes: 24, dislikes: 2, comments: 8, saves: 5 },
  '2': { likes: 18, dislikes: 1, comments: 12, saves: 7 },
  '3': { likes: 42, dislikes: 3, comments: 6, saves: 14 },
  '4': { likes: 15, dislikes: 4, comments: 3, saves: 2 },
}

// ─── Read Later (simulates storySave JOIN story) ──────────────────────────────

export const MOCK_READ_LATER = [
  { storyId: '3', savedAt: '2026-02-10T09:00:00Z', story: MOCK_STORIES[2] },
  { storyId: '1', savedAt: '2026-01-20T14:00:00Z', story: MOCK_STORIES[0] },
  { storyId: '2', savedAt: '2025-12-15T11:00:00Z', story: MOCK_STORIES[1] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getStoryById(id: string): Story | undefined {
  return MOCK_STORIES.find(s => s.id === id)
}

export function getCommentsByStoryId(storyId: string): StoryComment[] {
  return MOCK_COMMENTS.filter(c => c.storyId === storyId)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}
