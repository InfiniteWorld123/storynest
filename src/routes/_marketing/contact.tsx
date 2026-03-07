import { createFileRoute } from '@tanstack/react-router'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'

import { SectionHeading } from '../../components/common/section-heading'
import { Container } from '../../components/layout/container'
import { SiteLayout } from '../../components/layout/site-layout'
import { Reveal } from '../../components/motion/reveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import { Textarea } from '../../components/ui/textarea'
import { faqItems } from '../../data/mock-content'

export const Route = createFileRoute('/_marketing/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <SiteLayout>
      <Container className='relative z-10 space-y-12 py-10 sm:py-14'>
        <Reveal>
          <SectionHeading
            eyebrow='Contact'
            title='Send a raven'
            description='Questions, story submissions, and partnership notes are all welcome here.'
            align='left'
          />
        </Reveal>

        <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
          <Reveal>
            <Card>
              <CardContent className='p-6 sm:p-8'>
                <form className='space-y-5' noValidate>
                  <div className='grid gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input id='name' placeholder='Lira Nightingale' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='lira@storynest.com' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input id='subject' placeholder='A folktale proposal' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea id='message' placeholder='Write your message to the archive team...' />
                  </div>

                  <Button type='submit' className='w-full sm:w-auto'>
                    Send Message
                  </Button>
                  <p className='text-xs text-[hsl(var(--muted-foreground))]'>
                    UI-only form placeholder. No message is actually sent.
                  </p>
                </form>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card className='h-fit'>
              <CardContent className='space-y-5 p-6'>
                <div className='space-y-1'>
                  <CardTitle className='text-2xl'>Reading Room</CardTitle>
                  <CardDescription className='text-sm'>
                    Keep correspondence sealed with wax and wonder.
                  </CardDescription>
                </div>
                <Separator />
                <ul className='space-y-3 text-sm'>
                  <li className='inline-flex items-start gap-2'>
                    <MapPin className='mt-0.5 h-4 w-4 text-[hsl(var(--primary))]' />
                    14 Lantern Row, Old Quarter, London
                  </li>
                  <li className='inline-flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-[hsl(var(--primary))]' />
                    hello@storynest.archive
                  </li>
                  <li className='inline-flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-[hsl(var(--primary))]' />
                    +44 020 7946 0142
                  </li>
                  <li className='inline-flex items-center gap-2'>
                    <Clock3 className='h-4 w-4 text-[hsl(var(--primary))]' />
                    Mon-Fri, 09:00-18:00
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <section className='space-y-6'>
          <SectionHeading
            eyebrow='FAQ'
            title='Common questions from readers'
            description='Quick answers while your raven is in flight.'
            align='left'
          />
          <Accordion>
            {faqItems.map((item) => (
              <AccordionItem key={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </Container>
    </SiteLayout>
  )
}
