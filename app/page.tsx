import { FeatureSection } from "./(main)/features";
import { Footer } from "./(main)/footer";
import { Hero } from "./(main)/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeatureSection />
      {/* <CTA />  */}
      <Footer />
    </div>
  );
}
