"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { Button } from "~/components/primitives/button";
import { login } from "~/lib/auth/actions";

export function Login() {
  const [state, formAction] = useFormState(login, null);

  return (
    <Button outline className="w-full">
      <Link href="/login/discord">
        <GithubIcon className="mr-2 h-5 w-5" />
        Log in with Discord
      </Link>
    </Button>
  );
}
