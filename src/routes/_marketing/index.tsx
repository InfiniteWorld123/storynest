import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, BookmarkCheck, ScrollText } from 'lucide-react'

import { FeatureCard } from '../../components/cards/feature-card'
import { StoryCard } from '../../components/cards/story-card'
import { TestimonialCard } from '../../components/cards/testimonial-card'
import { OrnamentalSeparator } from '../../components/common/ornamental-separator'
import { SectionHeading } from '../../components/common/section-heading'
import { Container } from '../../components/layout/container'
import { SiteLayout } from '../../components/layout/site-layout'
import { FloatingOrnaments } from '../../components/motion/floating-ornaments'
import { Reveal } from '../../components/motion/reveal'
import { buttonVariants } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import {
  featuredIn,
  featuredStories,
  features,
  homeChapters,
  testimonials,
} from '../../data/mock-content'

export const Route = createFileRoute('/_marketing/')({
  component: HomePage,
})

function HomePage() {
  return (
    <SiteLayout>
      <Container className='relative z-10 space-y-20 py-10 sm:py-14'>
        <section className='relative overflow-hidden rounded-[2rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-6 py-10 shadow-[0_20px_55px_rgba(57,36,24,0.12)] sm:px-10 sm:py-14'>
          <FloatingOrnaments />
          <div className='relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
            <Reveal className='space-y-6'>
              <p className='chapter-label'>The Story Archive</p>
              <h1 className='font-story-serif text-4xl leading-tight sm:text-5xl lg:text-6xl'>
                Where old tales find new readers.
              </h1>
              <p className='max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg'>
                StoryNest is a warm, paper-toned reading room for folklore, mystery, romance, and history.
                Read deeply, collect notes, and share your own chapters.
              </p>
              <div className='flex flex-wrap gap-3'>
                <Link to='/explore' className={buttonVariants({ size: 'lg' })}>
                  Start Reading <ArrowRight className='h-4 w-4' />
                </Link>
                <Link to='/sign-up' className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                  Join the Archive
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Card className='relative border-dashed bg-[hsl(var(--card))]/92'>
                <CardContent className='space-y-5 p-7'>
                  <p className='chapter-label'>Membership Card</p>
                  <h2 className='font-story-serif text-2xl'>Library Circle, Est. Chapter I</h2>
                  <p className='text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>
                    Keep a private ledger of stories, unlock curated shelves, and receive weekly reading dispatches.
                  </p>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/35 p-3'>
                      <p className='font-medium'>18,000+</p>
                      <p className='text-xs text-[hsl(var(--muted-foreground))]'>Stories archived</p>
                    </div>
                    <div className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/35 p-3'>
                      <p className='font-medium'>42 regions</p>
                      <p className='text-xs text-[hsl(var(--muted-foreground))]'>Folklore origins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        <Reveal className='space-y-4'>
          <p className='text-center text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]'>Featured in</p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            {featuredIn.map((entry) => (
              <Badge key={entry} className='rounded-md px-3 py-1.5 text-xs'>
                {entry}
              </Badge>
            ))}
          </div>
        </Reveal>

        <section className='space-y-8'>
          <SectionHeading
            eyebrow='A Curated Reading Experience'
            title='Built like an old library, tuned for modern readers.'
            description='Simple rituals, thoughtful curation, and a visual language inspired by paper, ink, and quiet shelves.'
          />
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <Reveal key={feature.id} delay={index * 0.05}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>
        </section>

        <OrnamentalSeparator />

        <section className='space-y-8'>
          <SectionHeading
            eyebrow='Featured Stories'
            title='Today’s open chapters'
            description='A small stack from the archive, ready to read.'
          />
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {featuredStories.map((story, index) => (
              <Reveal key={story.id} delay={index * 0.04}>
                <StoryCard story={story} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className='space-y-8'>
          <SectionHeading eyebrow='How It Works' title='Three chapters to begin' />
          <div className='grid gap-4 lg:grid-cols-3'>
            {homeChapters.map((step, index) => (
              <Reveal key={step.id} delay={index * 0.06}>
                <Card className='h-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/80'>
                  <CardContent className='space-y-3 p-6'>
                    <p className='chapter-label'>{step.chapter}</p>
                    <h3 className='font-story-serif text-2xl'>{step.title}</h3>
                    <p className='text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>{step.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section className='space-y-8'>
          <SectionHeading eyebrow='Reader Notes' title='What the reading room feels like' />
          <div className='grid gap-4 md:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 0.05}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <Card className='rounded-[2rem] border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--accent))]/45 shadow-[0_16px_48px_rgba(58,35,24,0.12)]'>
            <CardContent className='px-8 py-10'>
              <div className='grid items-center gap-6 lg:grid-cols-[1fr_auto]'>
                <div className='space-y-3'>
                  <p className='chapter-label'>Membership Invitation</p>
                  <h2 className='font-story-serif text-3xl'>Claim your library card</h2>
                  <p className='max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>
                    Save your place in every chapter, curate personal shelves, and share stories that deserve careful
                    readers.
                  </p>
                </div>
                <div className='flex flex-wrap gap-3'>
                  <Link to='/sign-up' className={buttonVariants({ size: 'lg' })}>
                    Join the Archive
                  </Link>
                  <Link to='/explore' className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                    Browse Stories
                  </Link>
                </div>
              </div>
              <div className='mt-8 flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]'>
                <span className='inline-flex items-center gap-2'>
                  <BadgeCheck className='h-4 w-4 text-[hsl(var(--primary))]' /> Curated every week
                </span>
                <span className='inline-flex items-center gap-2'>
                  <BookmarkCheck className='h-4 w-4 text-[hsl(var(--primary))]' /> Save chapter notes
                </span>
                <span className='inline-flex items-center gap-2'>
                  <ScrollText className='h-4 w-4 text-[hsl(var(--primary))]' /> Publish your own folktales
                </span>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </Container>
    </SiteLayout>
  )
}
