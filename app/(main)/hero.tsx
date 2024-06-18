import { Section, Container } from "~/components/blocks";
import Balancer from "react-wrap-balancer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import Placeholder from "~/public/placeholder.jpg";
import Image from "next/image";

export const Hero = () => {
  return (
    <Section className="font-sans mt-20">
      <Container>
        <div>
          <Badge className="w-fit mb-6" variant="outline">
            <Link
              className="group font-medium flex items-center gap-1.5"
              href="https://github.com/ephraimduncan/linkboard"
            >
              Star on GitHub
              <ArrowRight className="w-4 transition-all group-hover:-rotate-45" />
            </Link>
          </Badge>
          <h1 className="text-5xl mb-2">
            <Balancer>linkboard</Balancer>
          </h1>
          <h3 className="text-2xl font-light opacity-70">
            <Balancer>social bookmarking for everyone</Balancer>
          </h3>
          <Image className="cursor-pointer bg-black mt-4" src="/gaudmire.svg" width={140} height={100} alt="n&w s5" />
          <div className="my-8 h-96 not-prose w-full overflow-hidden border rounded-lg md:rounded-xl md:h-[520px]">
            <Image
              className="h-full w-full object-cover object-bottom"
              src={Placeholder}
              width={1920}
              height={1080}
              alt="hero image"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};
