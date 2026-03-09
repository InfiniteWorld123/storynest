import { createFileRoute } from '@tanstack/react-router'
import { Filter, Search } from 'lucide-react'

import { StoryCard } from '../../../components/cards/story-card'
import { SectionHeading } from '../../../components/common/section-heading'
import { Container } from '../../../components/layout/container'
import { SiteLayout } from '../../../components/layout/site-layout'
import { Reveal } from '../../../components/motion/reveal'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Separator } from '../../../components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet'
import { categories, allStories } from '../../../data/mock-content'

export const Route = createFileRoute('/_marketing/explore')({
  component: ExplorePage,
})

function ExplorePage() {
  // Static state placeholders for training
  const query = ''
  const selectedCategory = 'All'
  const isFilterOpen = false

  // Static list for UI display
  const visibleStories = allStories.slice(0, 6)

  return (
    <SiteLayout>
      <Container className='relative z-10 space-y-8 py-10 sm:py-14'>
        <Reveal className='space-y-4'>
          <SectionHeading
            eyebrow='Explore The Archive'
            title='Find your next chapter'
            description='Search and browse stories across folklore, mystery, romance, myth, travel, and history.'
            align='left'
          />
        </Reveal>

        <Reveal className='space-y-4'>
          <Card className='border-[hsl(var(--border))] bg-[hsl(var(--card))]/90'>
            <CardContent className='space-y-4 p-4 sm:p-5'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='relative flex-1'>
                  <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]' />
                  <Input
                    value={query}
                    readOnly
                    placeholder='Search by title, author, or phrase...'
                    className='pl-9'
                    aria-label='Search stories'
                  />
                </div>

                <Sheet open={isFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant='outline' className='inline-flex lg:hidden'>
                      <Filter className='mr-2 h-4 w-4' /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='right'>
                    <SheetHeader>
                      <SheetTitle>Filter Stories</SheetTitle>
                      <SheetDescription>Choose a category to narrow the reading shelf.</SheetDescription>
                    </SheetHeader>
                    <div className='space-y-2'>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          type='button'
                          variant={selectedCategory === category ? 'secondary' : 'ghost'}
                          className='w-full justify-start border border-[hsl(var(--border))]'
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <Separator />

              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => (
                  <Button
                    key={category}
                    type='button'
                    size='sm'
                    variant={selectedCategory === category ? 'secondary' : 'outline'}
                    className='rounded-full'
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <div className='grid gap-6 lg:grid-cols-[260px_1fr]'>
          <aside className='hidden lg:block'>
            <Reveal>
              <Card className='border-[hsl(var(--border))] bg-[hsl(var(--card))]/90'>
                <CardHeader className='space-y-2'>
                  <CardTitle className='text-2xl'>Shelf Filters</CardTitle>
                  <p className='text-sm text-[hsl(var(--muted-foreground))]'>
                    Choose a category and refine the current shelf.
                  </p>
                </CardHeader>
                <CardContent className='space-y-2 pt-0'>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type='button'
                      variant={selectedCategory === category ? 'secondary' : 'ghost'}
                      className='w-full justify-start border border-[hsl(var(--border))]'
                    >
                      {category}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </Reveal>
          </aside>

          <section className='space-y-6'>
            <p className='text-sm text-[hsl(var(--muted-foreground))]'>
              Showing {visibleStories.length} of {allStories.length} stories
            </p>

            <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
              {visibleStories.map((story, index) => (
                <Reveal key={story.id} delay={index * 0.03}>
                  <StoryCard story={story} />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </SiteLayout>
  )
}

