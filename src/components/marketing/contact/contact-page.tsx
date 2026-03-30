import { PageHero } from '#/components/marketing/shared/page-hero'
import { ContactFormCard } from './contact-form-card'
import { ContactDetailsCard } from './contact-details-card'

export function ContactPage() {
  return (
    <>
      <PageHero
        badge="Get in Touch"
        title="We'd love to hear from you"
        description="Whether you have a question, feedback, or just want to say hello — we're here."
      />
      <section className="pb-20 md:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactFormCard />
            </div>
            <div className="lg:col-span-2">
              <ContactDetailsCard />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
