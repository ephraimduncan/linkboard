import { Section, Container } from "~/components/blocks";
import { Github, Twitter } from "lucide-react";
import { Button } from "~/components/primitives/button";

export const Footer = () => {
  return (
    <footer>
      <Section>
        <Container className="not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
          <div className="flex gap-2">
            <a href="https://github.com/ephraimduncan" target="_blank">
              <Button>
                <Github />
              </Button>
            </a>
            <a href="https://x.com/ephraimduncan" target="_blank">
              <Button>
                <Twitter />
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground">
            © <a href="https://github.com/ephraimduncan">Ephraim Duncan</a>. All rights reserved. 2024-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
};
