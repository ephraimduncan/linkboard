import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { Container, Section } from "~/components/blocks";
import { Link } from "~/components/primitives/link";
import { auth } from "~/lib/auth/validate-request";
import AppDemoImage from "~/public/app-demo.png";
import { LoginDialog } from "./login-dialog";

export const Hero = async () => {
  const { user } = await auth();

  return (
    <Section className="font-sans mt-20">
      <Container>
        <div className="flex gap-5 text-lg items-end justify-end">
          {user ? <Link href="/dashboard">Dashboard</Link> : <LoginDialog />}
        </div>
        <div>
          <Link
            className="border w-fit p-2 mb-5 font-medium py-0.5 rounded-md text-xs group flex items-center gap-1.5"
            href="https://github.com/ephraimduncan/linkboard"
          >
            Star on GitHub
            <ArrowRight className="w-4 transition-all group-hover:-rotate-45" />
          </Link>
          <h1 className="text-5xl mb-2">
            <Balancer>linkboard</Balancer>
          </h1>
          <h3 className="text-2xl font-light opacity-70">
            <Balancer>social bookmarking for everyone</Balancer>
          </h3>
          {/* <Image className="cursor-pointer bg-black mt-4" src="/gaudmire.svg" width={140} height={100} alt="n&w s5" /> */}
          <div className="my-8 h-96 not-prose w-full overflow-hidden border rounded-lg md:rounded-xl md:h-full">
            <Image
              className="h-full w-full object-cover"
              src={AppDemoImage}
              width={2594}
              height={2226}
              alt="hero image"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};
