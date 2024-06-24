import { redirect } from "next/navigation";
import { Link } from "~/components/primitives/link";
import { validateRequest } from "~/lib/auth/validate-request";
import { Paths } from "~/lib/constants";

export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.Dashboard);

  return (
    <>
      <Link href="/login/discord">Log in with Discord</Link>
      <Link href="/login/github">Log in with Github</Link>
    </>
  );
}
