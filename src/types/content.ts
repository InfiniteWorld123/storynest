import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type StoryCategory = 'Folklore' | 'Mystery' | 'Romance' | 'Myth' | 'Travel' | 'History'

export interface Story {
  id: string
  title: string
  excerpt: string
  category: StoryCategory
  readTime: string
  chapter: string
  author: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  initials: string
  note: string
}

export interface TimelineStep {
  id: string
  chapter: string
  title: string
  description: string
}

export interface ValueCard {
  id: string
  title: string
  description: string
}

export interface StoryCardProps {
  story: Story
  className?: string
}

export interface FeatureCardProps {
  feature: Feature
  className?: string
}

export interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export interface AuthLayoutProps {
  title: string
  description: string
  quote?: string
  quoteAuthor?: string
  children: ReactNode
  footer?: ReactNode
}

export interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}
