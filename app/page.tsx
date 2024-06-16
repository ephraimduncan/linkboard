import { FeatureSection } from "./(main)/features";
import { Footer } from "./(main)/footer";
import { Hero } from "./(main)/hero";
import { CTA } from "./(main)/waitlist";

export default function Home() {
  return (
    <div className="lowercase">
      <Hero />
      <FeatureSection />
      <CTA />
      <Footer />
    </div>
  );
}
