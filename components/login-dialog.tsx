import { Discord } from "~/components/icons/discord";
import { Github } from "~/components/icons/github";
import { Button } from "~/components/primitives/button";
import { DialogBlur } from "~/components/primitives/dialog";

export type LoginDialogProp = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export const LoginDialog = ({ open, onClose }: LoginDialogProp) => {
  return (
    <DialogBlur className="w-96" open={open} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-2xl">Log in</h2>
          <p className="text-muted-foreground">to continue to linkboard</p>
        </div>

        <div className="flex flex-col space-y-2">
          <Button href={"/login/github"} className="!font-normal">
            <Github className="size-5" />
            Continue with GitHub
          </Button>
          <Button href={"/login/discord"} className="!font-normal">
            <Discord className="size-5" />
            Continue with Discord
          </Button>

          <p className="text-sm text-muted-foreground">
            No account? We&apos;ll create one for you
          </p>
        </div>
      </div>
    </DialogBlur>
  );
};
