import { Container, Section } from "~/components/blocks";
import Balancer from "react-wrap-balancer";
import { Zap, LockKeyhole, Tag, Ban } from "lucide-react";

type FeatureText = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const featureText: FeatureText[] = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast",
    description: "No hassle, no clutter, seamlessly save bookmarks with our browser extension.",
  },
  {
    icon: <LockKeyhole className="h-6 w-6" />,
    title: "Privacy on Point",
    description: "Keep your secrets safe. Share what you want, keep the rest private.",
  },
  {
    icon: <Tag className="h-6 w-6" />,
    title: "Tag",
    description: "Use tags to keep your links organized and easy to find.",
  },
  {
    icon: <Ban className="h-6 w-6" />,
    title: "Ad-Free Zone",
    description: "No ads, no trackers, no nonsense. Just pure bookmarking.",
  },
];

export const FeatureSection = () => {
  return (
    <Section>
      <Container className="not-prose">
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl">
            <Balancer>Everything you need in a social bookmark app</Balancer>
          </h3>

          <div className="mt-4 grid gap-6 md:mt-8 md:grid-cols-4">
            {featureText.map(({ icon, title, description }, index) => (
              <div
                className="flex flex-col justify-between gap-6 rounded-lg border p-6 transition-all hover:-mt-2 hover:mb-2"
                key={index}
              >
                <div className="grid gap-4">
                  {icon}
                  <h4 className="text-primary text-xl">{title}</h4>
                  <p className="text-base opacity-75">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
