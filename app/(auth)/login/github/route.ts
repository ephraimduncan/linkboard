import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "~/lib/auth";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["read:user", "user:email"],
  });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
