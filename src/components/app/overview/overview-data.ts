import type {
  OverviewBreakdownGroup,
  OverviewCategoryPoint,
  OverviewHealthMetric,
  OverviewKpi,
  OverviewLeaderboardGroup,
  OverviewMonthlyPoint,
  OverviewReactionSlice,
  OverviewRecentComment,
  OverviewRecentEdit,
  OverviewRecentSave,
  OverviewTimeframe,
  OverviewTrendPoint,
} from '#/components/app/overview/types'

export const OVERVIEW_TIMEFRAMES: OverviewTimeframe[] = ['7D', '30D', '90D']
export const OVERVIEW_ACTIVE_TIMEFRAME: OverviewTimeframe = '30D'
export const OVERVIEW_LAST_UPDATED = 'Mar 20, 2026 • 18:22'

export const OVERVIEW_KPIS: OverviewKpi[] = [
  { id: 'stories-authored', label: 'Stories Authored', value: '24', hint: 'Total stories created', delta: '+3 this month' },
  { id: 'comments-written', label: 'Comments Written', value: '58', hint: 'Comments you posted', delta: '+8 this week' },
  { id: 'saved-by-me', label: 'Saved by Me', value: '17', hint: 'Stories in read later', delta: '+5 this month' },
  { id: 'likes-given', label: 'Likes Given', value: '92', hint: 'Reactions you gave', delta: '+11 this week' },
  { id: 'dislikes-given', label: 'Dislikes Given', value: '9', hint: 'Dislikes you gave', delta: '-2 vs last month' },
  { id: 'likes-received', label: 'Likes Received', value: '316', hint: 'On your stories', delta: '+29 this month' },
  { id: 'dislikes-received', label: 'Dislikes Received', value: '27', hint: 'On your stories', delta: '+1 this month' },
  { id: 'comments-received', label: 'Comments Received', value: '144', hint: 'On your stories', delta: '+15 this month' },
  { id: 'saves-received', label: 'Saves Received', value: '131', hint: 'Your stories saved by others', delta: '+12 this month' },
  { id: 'categories-used', label: 'Categories Used', value: '6', hint: 'Distinct writing categories', delta: '2 new this year' },
]

export const OVERVIEW_HEALTH: OverviewHealthMetric[] = [
  { id: 'avg-likes-story', label: 'Avg Likes / Story', value: '13.2', hint: 'Likes received ÷ stories' },
  { id: 'avg-comments-story', label: 'Avg Comments / Story', value: '6.0', hint: 'Comments received ÷ stories' },
  { id: 'like-dislike-ratio', label: 'Like : Dislike', value: '11.7 : 1', hint: 'Higher is healthier sentiment' },
  { id: 'save-rate', label: 'Save Rate', value: '5.5', hint: 'Saves received per story' },
]

export const OVERVIEW_DAILY_TREND: OverviewTrendPoint[] = [
  { label: 'Mon', likes: 11, comments: 5, saves: 4 },
  { label: 'Tue', likes: 14, comments: 7, saves: 6 },
  { label: 'Wed', likes: 9, comments: 4, saves: 3 },
  { label: 'Thu', likes: 17, comments: 8, saves: 7 },
  { label: 'Fri', likes: 15, comments: 9, saves: 8 },
  { label: 'Sat', likes: 12, comments: 6, saves: 5 },
  { label: 'Sun', likes: 19, comments: 10, saves: 9 },
]

export const OVERVIEW_REACTION_MIX: OverviewReactionSlice[] = [
  { name: 'Likes', value: 316, color: 'var(--accent-warm)' },
  { name: 'Dislikes', value: 27, color: 'oklch(0.58 0.17 27)' },
]

export const OVERVIEW_CATEGORY_ACTIVITY: OverviewCategoryPoint[] = [
  { category: 'Folklore', likes: 74, comments: 35, saves: 28 },
  { category: 'Mystery', likes: 62, comments: 31, saves: 22 },
  { category: 'Romance', likes: 81, comments: 29, saves: 34 },
  { category: 'Myth', likes: 54, comments: 24, saves: 19 },
  { category: 'Travel', likes: 45, comments: 18, saves: 14 },
]

export const OVERVIEW_MONTHLY_OUTPUT: OverviewMonthlyPoint[] = [
  { month: 'Oct', stories: 2 },
  { month: 'Nov', stories: 3 },
  { month: 'Dec', stories: 4 },
  { month: 'Jan', stories: 5 },
  { month: 'Feb', stories: 6 },
  { month: 'Mar', stories: 4 },
]

export const OVERVIEW_LEADERBOARDS: OverviewLeaderboardGroup[] = [
  {
    id: 'top-liked',
    title: 'Top Stories by Likes',
    description: 'Best performing stories by likes received.',
    countLabel: 'likes',
    rows: [
      { storyId: 's-01', storyTitle: 'The Fog of Innisfree', category: 'Folklore', count: 58, updatedAt: 'Mar 18' },
      { storyId: 's-02', storyTitle: 'Letters Never Sent', category: 'Romance', count: 53, updatedAt: 'Mar 17' },
      { storyId: 's-03', storyTitle: "The Cartographer's Ghost", category: 'Mystery', count: 47, updatedAt: 'Mar 15' },
      { storyId: 's-04', storyTitle: 'Salt and Old Gods', category: 'Myth', count: 41, updatedAt: 'Mar 14' },
      { storyId: 's-05', storyTitle: 'A City of Lanterns', category: 'Travel', count: 32, updatedAt: 'Mar 12' },
    ],
  },
  {
    id: 'top-saved',
    title: 'Top Stories by Saves',
    description: 'Stories readers save most often for later.',
    countLabel: 'saves',
    rows: [
      { storyId: 's-02', storyTitle: 'Letters Never Sent', category: 'Romance', count: 31, updatedAt: 'Mar 17' },
      { storyId: 's-01', storyTitle: 'The Fog of Innisfree', category: 'Folklore', count: 27, updatedAt: 'Mar 18' },
      { storyId: 's-06', storyTitle: 'Monastery by the Tide', category: 'Myth', count: 23, updatedAt: 'Mar 13' },
      { storyId: 's-03', storyTitle: "The Cartographer's Ghost", category: 'Mystery', count: 21, updatedAt: 'Mar 15' },
      { storyId: 's-07', storyTitle: 'The Winter Correspondent', category: 'History', count: 18, updatedAt: 'Mar 10' },
    ],
  },
  {
    id: 'most-commented',
    title: 'Most Commented Stories',
    description: 'Stories sparking the largest discussion.',
    countLabel: 'comments',
    rows: [
      { storyId: 's-03', storyTitle: "The Cartographer's Ghost", category: 'Mystery', count: 42, updatedAt: 'Mar 15' },
      { storyId: 's-02', storyTitle: 'Letters Never Sent', category: 'Romance', count: 34, updatedAt: 'Mar 17' },
      { storyId: 's-04', storyTitle: 'Salt and Old Gods', category: 'Myth', count: 29, updatedAt: 'Mar 14' },
      { storyId: 's-01', storyTitle: 'The Fog of Innisfree', category: 'Folklore', count: 24, updatedAt: 'Mar 18' },
      { storyId: 's-08', storyTitle: 'Maps of the Ninth Coast', category: 'Travel', count: 19, updatedAt: 'Mar 11' },
    ],
  },
]

export const OVERVIEW_RECENT_COMMENTS: OverviewRecentComment[] = [
  {
    id: 'c-01',
    storyTitle: 'The Fog of Innisfree',
    author: 'Nora Lane',
    excerpt: 'The ending felt haunting in the best way. Loved the atmosphere.',
    createdAt: '2h ago',
  },
  {
    id: 'c-02',
    storyTitle: "The Cartographer's Ghost",
    author: 'Ari Bloom',
    excerpt: 'Could you publish a part two? This world-building is incredible.',
    createdAt: '5h ago',
  },
  {
    id: 'c-03',
    storyTitle: 'Letters Never Sent',
    author: 'Mina Hart',
    excerpt: 'The letters in chapter four broke me. Beautiful pacing.',
    createdAt: '8h ago',
  },
  {
    id: 'c-04',
    storyTitle: 'Salt and Old Gods',
    author: 'Theo Marsh',
    excerpt: 'The sea-deity lore was so vivid. Please expand this universe.',
    createdAt: '1d ago',
  },
]

export const OVERVIEW_RECENT_SAVES: OverviewRecentSave[] = [
  { id: 'rs-01', storyTitle: 'Dust Over Cordoba', savedAt: '45m ago' },
  { id: 'rs-02', storyTitle: 'Lanterns in June', savedAt: '3h ago' },
  { id: 'rs-03', storyTitle: 'River Market Diaries', savedAt: '6h ago' },
  { id: 'rs-04', storyTitle: 'The Last Bell Tower', savedAt: '1d ago' },
]

export const OVERVIEW_RECENT_EDITS: OverviewRecentEdit[] = [
  { id: 're-01', storyTitle: 'Letters Never Sent', category: 'Romance', updatedAt: '35m ago' },
  { id: 're-02', storyTitle: "The Cartographer's Ghost", category: 'Mystery', updatedAt: '4h ago' },
  { id: 're-03', storyTitle: 'Salt and Old Gods', category: 'Myth', updatedAt: '9h ago' },
  { id: 're-04', storyTitle: 'A City of Lanterns', category: 'Travel', updatedAt: '1d ago' },
]

export const OVERVIEW_BREAKDOWNS: OverviewBreakdownGroup[] = [
  {
    id: 'breakdown-likes',
    title: 'Likes by Category',
    description: 'Received likes grouped by category.',
    rows: [
      { category: 'Romance', count: 81 },
      { category: 'Folklore', count: 74 },
      { category: 'Mystery', count: 62 },
      { category: 'Myth', count: 54 },
      { category: 'Travel', count: 45 },
    ],
  },
  {
    id: 'breakdown-comments',
    title: 'Comments by Category',
    description: 'Received comments grouped by category.',
    rows: [
      { category: 'Folklore', count: 35 },
      { category: 'Mystery', count: 31 },
      { category: 'Romance', count: 29 },
      { category: 'Myth', count: 24 },
      { category: 'Travel', count: 18 },
    ],
  },
  {
    id: 'breakdown-saves',
    title: 'Saves by Category',
    description: 'Reader saves grouped by category.',
    rows: [
      { category: 'Romance', count: 34 },
      { category: 'Folklore', count: 28 },
      { category: 'Mystery', count: 22 },
      { category: 'Myth', count: 19 },
      { category: 'Travel', count: 14 },
    ],
  },
]
