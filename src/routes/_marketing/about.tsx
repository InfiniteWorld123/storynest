import { createFileRoute } from '@tanstack/react-router'

import { SectionHeading } from '../../components/common/section-heading'
import { Container } from '../../components/layout/container'
import { SiteLayout } from '../../components/layout/site-layout'
import { Reveal } from '../../components/motion/reveal'
import { Card, CardContent } from '../../components/ui/card'
import { archiveTimeline, teamMembers, values } from '../../data/mock-content'

export const Route = createFileRoute('/_marketing/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <SiteLayout>
      <Container className='relative z-10 space-y-16 py-10 sm:py-14'>
        <Reveal>
          <Card className='border-[hsl(var(--border))] bg-[hsl(var(--card))]/90'>
            <CardContent className='space-y-6 p-7 sm:p-10'>
              <p className='chapter-label'>Our Mission</p>
              <h1 className='font-story-serif text-4xl leading-tight sm:text-5xl'>
                Preserving stories as living artifacts.
              </h1>
              <p className='max-w-3xl text-base leading-relaxed text-[hsl(var(--muted-foreground))]'>
                StoryNest began with a simple goal: keep old stories readable, shareable, and lovingly curated. We blend
                library-inspired design with modern comfort, so every chapter feels personal and lasting.
              </p>
            </CardContent>
          </Card>
        </Reveal>

        <section className='space-y-8'>
          <SectionHeading
            eyebrow='What We Value'
            title='Editorial care, reader trust, and cultural memory'
            description='We treat stories like heirlooms: handled gently, catalogued clearly, and shared responsibly.'
          />
          <div className='grid gap-4 md:grid-cols-3'>
            {values.map((value, index) => (
              <Reveal key={value.id} delay={index * 0.05}>
                <Card className='h-full'>
                  <CardContent className='space-y-3 p-6'>
                    <h3 className='font-story-serif text-2xl'>{value.title}</h3>
                    <p className='text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>{value.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section className='space-y-8'>
          <SectionHeading
            eyebrow='The Team'
            title='Caretakers of the archive'
            description='A small multidisciplinary team of editors, curators, and designers.'
          />
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {teamMembers.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.04}>
                <Card className='h-full'>
                  <CardContent className='space-y-4 p-6'>
                    <div className='flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/35 font-story-serif text-lg'>
                      {member.initials}
                    </div>
                    <div className='space-y-1'>
                      <h3 className='font-story-serif text-2xl'>{member.name}</h3>
                      <p className='text-sm font-medium text-[hsl(var(--primary))]'>{member.role}</p>
                    </div>
                    <p className='text-sm text-[hsl(var(--muted-foreground))]'>{member.note}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section className='space-y-8'>
          <SectionHeading
            eyebrow='From first page to chapter ten'
            title='How StoryNest grew over time'
            description='A timeline of milestones in our archive journey.'
          />
          <div className='space-y-4'>
            {archiveTimeline.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.04}>
                <Card className='border-[hsl(var(--border))] bg-[hsl(var(--card))]/85'>
                  <CardContent className='grid gap-4 p-5 sm:grid-cols-[180px_1fr] sm:items-start'>
                    <p className='chapter-label h-fit'>{item.chapter}</p>
                    <div className='space-y-2'>
                      <h3 className='font-story-serif text-2xl'>{item.title}</h3>
                      <p className='text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </SiteLayout>
  )
}
