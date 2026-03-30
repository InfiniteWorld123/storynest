import { PageHero } from '#/components/marketing/shared/page-hero'
import { CtaBand } from '#/components/marketing/shared/cta-band'
import { StorySection } from './story-section'
import { MissionGrid } from './mission-grid'
import { PrinciplesStrip } from './principles-strip'

export function AboutPage() {
  return (
    <>
      <PageHero
        badge="About StoryNest"
        title="A home built for stories"
        description="StoryNest exists because we believe stories deserve a better home — one built with intention, craft, and respect for the reader's attention."
      />
      <StorySection />
      <MissionGrid />
      <PrinciplesStrip />
      <CtaBand
        title="Ready to explore?"
        description="Discover stories that matter or begin writing your own."
        primaryLabel="Get Started"
        primaryHref="/sign-up"
        secondaryLabel="Browse Stories"
        secondaryHref="/"
      />
    </>
  )
}
