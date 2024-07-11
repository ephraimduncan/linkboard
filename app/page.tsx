import { FeatureSection } from "./(landing)/features";
import { Footer } from "./(landing)/footer";
import { Hero } from "./(landing)/hero";

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
