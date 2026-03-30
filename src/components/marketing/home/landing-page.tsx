import { HeroSection } from './hero-section'
import { FeatureGrid } from './feature-grid'
import { ProcessStrip } from './process-strip'
import { FinalCta } from './final-cta'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <ProcessStrip />
      <FinalCta />
    </>
  )
}
