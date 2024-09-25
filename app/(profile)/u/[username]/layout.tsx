import NextLink from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { Login } from "~/app/(landing)/login";
import { auth } from "~/lib/auth/validate-request";
import Profile from "./profile";

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { username: string };
}>) {
  const { user: loggedInUser } = await auth();

  if (!params.username) {
    notFound();
  }

  return (
    <div className="bg-stone-50">
      <div className="max-w-5xl mx-auto min-h-screen p-8 pt-10 gap-y-8">
        <div className="flex items-center justify-between !mb-6">
          <h1 className="text-2xl font-sans">
            <NextLink href={`/u/${params.username}`}>
              <Balancer>linkboard</Balancer>
            </NextLink>
          </h1>

          <div className="flex gap-5 text-lg items-end justify-end">
            {loggedInUser ? (
              <NextLink href="/dashboard">Dashboard</NextLink>
            ) : (
              <Login />
            )}
            <NextLink href="/discover">discover</NextLink>
          </div>
        </div>

        <Profile username={params.username}>{children}</Profile>
      </div>
    </div>
  );
}
