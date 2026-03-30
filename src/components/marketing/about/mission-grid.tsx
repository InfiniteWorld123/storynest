import { Heart, Shield, Sparkles } from 'lucide-react'
import { SectionHeading } from '#/components/marketing/shared/section-heading'
import { FeatureCard } from '#/components/marketing/shared/feature-card'

const missions = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Elevate Storytelling',
    description:
      'We believe in the power of long-form narrative to change perspectives, build empathy, and create connection.',
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: 'Foster Community',
    description:
      'Connecting readers and writers through a shared passion for stories that explore the depth of human experience.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Respect Attention',
    description:
      'Designed to reward focused reading and thoughtful writing — not endless scrolling or attention hijacking.',
  },
]

export function MissionGrid() {
  return (
    <section className="bg-muted/30 py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Our Mission"
          title="What drives us"
          description="Three pillars that guide everything we build."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16">
          {missions.map((mission) => (
            <FeatureCard key={mission.title} {...mission} />
          ))}
        </div>
      </div>
    </section>
  )
}
