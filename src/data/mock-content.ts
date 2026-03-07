import {
  BookMarked,
  BookOpenCheck,
  Compass,
  Feather,
  Lamp,
  Library,
  NotebookPen,
  ScrollText,
  Sparkles,
} from 'lucide-react'

import type {
  FaqItem,
  Feature,
  Story,
  StoryCategory,
  TeamMember,
  Testimonial,
  TimelineStep,
  ValueCard,
} from '../types/content'

export const featuredIn = ['The Lantern Review', 'Northbound Journal', 'House of Folklore', 'The Gilded Reader']

export const features: Feature[] = [
  {
    id: 'feature-curated',
    title: 'Curated Story Shelves',
    description: 'Browse hand-picked collections arranged like chapters in an old library catalogue.',
    icon: Library,
  },
  {
    id: 'feature-margins',
    title: 'Margin Notes & Highlights',
    description: 'Save lines that stay with you and keep them beside each story like paper notes.',
    icon: NotebookPen,
  },
  {
    id: 'feature-rituals',
    title: 'Reading Rituals',
    description: 'Switch from bright parchment to moonlit ink for long evening reading sessions.',
    icon: Lamp,
  },
  {
    id: 'feature-discovery',
    title: 'Unexpected Discoveries',
    description: 'Find hidden gems across folklore, travel journals, romance, and mystery archives.',
    icon: Compass,
  },
]

export const allStories: Story[] = [
  {
    id: 'story-1',
    title: 'The Bell Keeper of Hollow Mere',
    excerpt: 'Each dusk, one bell rang from a tower no map could find. Mara set out with a lantern and a promise.',
    category: 'Folklore',
    readTime: '8 min read',
    chapter: 'Chapter II',
    author: 'E. Northwood',
  },
  {
    id: 'story-2',
    title: 'A Letter Beneath the Floorboards',
    excerpt: 'A missing page in an inherited diary pointed to a sealed room and a family name erased in ink.',
    category: 'Mystery',
    readTime: '11 min read',
    chapter: 'Chapter V',
    author: 'D. Halbrook',
  },
  {
    id: 'story-3',
    title: 'When the Orchard Bloomed in Winter',
    excerpt: 'Two rivals traded recipes and silence until snow began to smell like apricots.',
    category: 'Romance',
    readTime: '7 min read',
    chapter: 'Chapter I',
    author: 'L. Pembroke',
  },
  {
    id: 'story-4',
    title: 'The River That Remembered Names',
    excerpt: 'An old ferryman warned that the river would return only what was spoken honestly to it.',
    category: 'Myth',
    readTime: '9 min read',
    chapter: 'Chapter III',
    author: 'S. Vale',
  },
  {
    id: 'story-5',
    title: 'Caravan to the Amber Coast',
    excerpt: 'A travel log from cedar deserts to sea cliffs, stitched with weathered sketches and songs.',
    category: 'Travel',
    readTime: '10 min read',
    chapter: 'Chapter VII',
    author: 'M. Alder',
  },
  {
    id: 'story-6',
    title: 'The Cartographer of Lost Courts',
    excerpt: 'In a city of shifting alleys, one mapmaker charted places the crown insisted never existed.',
    category: 'History',
    readTime: '12 min read',
    chapter: 'Chapter IX',
    author: 'T. Bramble',
  },
  {
    id: 'story-7',
    title: 'The Fox at Lantern Bridge',
    excerpt: 'Children left ribbons for a fox spirit said to guide wanderers home before dawn.',
    category: 'Folklore',
    readTime: '6 min read',
    chapter: 'Chapter IV',
    author: 'K. Rowan',
  },
  {
    id: 'story-8',
    title: 'Ashes in the Conservatory',
    excerpt: 'After the winter gala, only one room burned and one guest vanished without footprints.',
    category: 'Mystery',
    readTime: '13 min read',
    chapter: 'Chapter VI',
    author: 'I. Wren',
  },
  {
    id: 'story-9',
    title: 'Postcards to the Moonkeeper',
    excerpt: 'A long-distance romance unfolded through unsent postcards tucked into a station clock.',
    category: 'Romance',
    readTime: '8 min read',
    chapter: 'Chapter II',
    author: 'N. Faulk',
  },
  {
    id: 'story-10',
    title: 'The Fifth Crown of Briar Hall',
    excerpt: 'Legends spoke of four crowns. The fifth was not worn, but read aloud under rain.',
    category: 'Myth',
    readTime: '9 min read',
    chapter: 'Chapter VIII',
    author: 'R. Hollow',
  },
  {
    id: 'story-11',
    title: 'Sleeper Train to Bellharbor',
    excerpt: 'A night train route reopened after thirty years, carrying old tickets and unfinished goodbyes.',
    category: 'Travel',
    readTime: '7 min read',
    chapter: 'Chapter III',
    author: 'A. Finch',
  },
  {
    id: 'story-12',
    title: 'The Last Archivist of Stonegate',
    excerpt: 'When city records vanished, one archivist rebuilt memory from receipts, lullabies, and court poems.',
    category: 'History',
    readTime: '14 min read',
    chapter: 'Chapter X',
    author: 'C. Merrow',
  },
]

export const featuredStories = allStories.slice(0, 6)

export const categories: Array<StoryCategory | 'All'> = [
  'All',
  'Folklore',
  'Mystery',
  'Romance',
  'Myth',
  'Travel',
  'History',
]

export const homeChapters: TimelineStep[] = [
  {
    id: 'home-step-1',
    chapter: 'Chapter I',
    title: 'Choose A Shelf',
    description: 'Start with a mood, theme, or era and open a shelf curated by our editors.',
  },
  {
    id: 'home-step-2',
    chapter: 'Chapter II',
    title: 'Read & Collect',
    description: 'Save stories, keep notes, and build a private reading ledger as you go.',
  },
  {
    id: 'home-step-3',
    chapter: 'Chapter III',
    title: 'Share Your Tale',
    description: 'Publish your own folktale draft in a format that feels like a printed chapter.',
  },
]

export const archiveTimeline: TimelineStep[] = [
  {
    id: 'timeline-1',
    chapter: 'Chapter One',
    title: 'A Single Shelf',
    description: 'StoryNest began as a tiny collection of handwritten folktales from village libraries.',
  },
  {
    id: 'timeline-2',
    chapter: 'Chapter Two',
    title: 'Letters From Readers',
    description: 'Readers started annotating stories and sending in their own retellings.',
  },
  {
    id: 'timeline-3',
    chapter: 'Chapter Three',
    title: 'The Traveling Archive',
    description: 'We partnered with local historians to document oral tales before they faded.',
  },
  {
    id: 'timeline-4',
    chapter: 'Chapter Seven',
    title: 'Night Reading Mode',
    description: 'By request, we introduced a moonlit palette for late-hours reading sessions.',
  },
  {
    id: 'timeline-5',
    chapter: 'Chapter Ten',
    title: 'The Open Story Room',
    description: 'Today, writers and readers gather here to keep the next generation of tales alive.',
  },
]

export const values: ValueCard[] = [
  {
    id: 'value-craft',
    title: 'Craft Over Noise',
    description: 'We prioritize thoughtful stories and careful editorial curation over endless feeds.',
  },
  {
    id: 'value-heritage',
    title: 'Living Heritage',
    description: 'Folktales and historical narratives are treated as living culture worth preserving.',
  },
  {
    id: 'value-community',
    title: 'Reader-Led Community',
    description: 'Our best discoveries come from readers sharing notes, references, and recommendations.',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote:
      'StoryNest feels like stepping into a candlelit reading room where every recommendation is handpicked.',
    name: 'Iris Whitlock',
    role: 'Book Club Curator',
  },
  {
    id: 'testimonial-2',
    quote: 'The annotations and chapter trails make it easy to lose an evening in the best way possible.',
    name: 'Noah Mercer',
    role: 'Historical Fiction Reader',
  },
  {
    id: 'testimonial-3',
    quote: 'I published my first folktale draft here and found readers who cared about every sentence.',
    name: 'Sarai Lark',
    role: 'Contributing Writer',
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Mara Ellison',
    role: 'Editorial Lead',
    initials: 'ME',
    note: 'Collects coastal legends and forgotten diaries.',
  },
  {
    id: 'team-2',
    name: 'Julian Harrow',
    role: 'Archive Curator',
    initials: 'JH',
    note: 'Maintains the historical and travel collections.',
  },
  {
    id: 'team-3',
    name: 'Leona Vale',
    role: 'Community Host',
    initials: 'LV',
    note: 'Guides writing circles and reader salons.',
  },
  {
    id: 'team-4',
    name: 'Caleb Thorn',
    role: 'Design Engineer',
    initials: 'CT',
    note: 'Shapes interfaces that feel like printed pages.',
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Can I publish stories here?',
    answer:
      'Yes. The current interface shows UI-only placeholders for submission and drafts. Publishing workflow can be connected later.',
  },
  {
    id: 'faq-2',
    question: 'Is there a night mode for reading?',
    answer:
      'Yes. Use the day/night toggle in the header to switch between parchment light mode and deep-ink night mode.',
  },
  {
    id: 'faq-3',
    question: 'Do you host only folklore?',
    answer:
      'Folklore is our heart, but the archive also features mystery, romance, myth, travel journals, and history chapters.',
  },
  {
    id: 'faq-4',
    question: 'Can I save favorites?',
    answer:
      'This UI demonstrates saved states visually. Real persistence can be integrated when backend support is added.',
  },
  {
    id: 'faq-5',
    question: 'How quickly do you answer messages?',
    answer: 'Usually within one business day, unless a raven takes the scenic route.',
  },
]

export const landingDecorIcons = [BookMarked, Feather, ScrollText, Sparkles, BookOpenCheck]
