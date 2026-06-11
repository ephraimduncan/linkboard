import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/lib/auth-server";
import { createDb } from "@/lib/db";
import { getPublicProfileData } from "@/server/queries/public-profile";
import { slugify } from "@/lib/utils";
import { APP_URL } from "@/lib/config";
import { PublicProfileContent } from "@/components/public-profile-content";

const getProfile = createServerFn({ method: "GET" })
  .validator((username: string) => username)
  .handler(async ({ data: username }) => {
    const db = createDb();
    const [data, session] = await Promise.all([
      getPublicProfileData(db, username),
      getSession(),
    ]);
    return { data, isLoggedIn: !!session };
  });

export const Route = createFileRoute("/u/$username/")({
  validateSearch: (search: Record<string, unknown>): { group?: string } => ({
    group: typeof search.group === "string" ? search.group : undefined,
  }),
  loader: async ({ params }) => {
    const { data, isLoggedIn } = await getProfile({ data: params.username });
    const username = data?.user.username;
    if (!data || !username) throw redirect({ to: "/dashboard" });

    return {
      user: { ...data.user, username },
      groups: data.groups,
      bookmarks: data.bookmarks,
      isLoggedIn,
    };
  },
  head: ({ loaderData, params, match }) => {
    if (!loaderData) return {};
    const { user, groups } = loaderData;
    const groupParam = match.search.group;
    const matchingGroup = groupParam
      ? groups.find(
          (g) => slugify(g.name) === groupParam || g.name === groupParam,
        )
      : undefined;
    const group = matchingGroup ? slugify(matchingGroup.name) : groupParam;

    const title = `${user.name} (@${user.username}) — minimal`;
    const description =
      user.bio || `Public bookmarks shared by ${user.name}`;

    const ogParams = new URLSearchParams({ username: params.username });
    if (group) ogParams.set("group", group);
    const ogUrl = `${APP_URL}/api/og?${ogParams.toString()}`;
    const pageUrl = group
      ? `${APP_URL}/u/${params.username}?group=${encodeURIComponent(group)}`
      : `${APP_URL}/u/${params.username}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: ogUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogUrl },
      ],
      links: [
        {
          rel: "alternate",
          type: "application/rss+xml",
          href: `${APP_URL}/u/${params.username}/feed.xml`,
        },
        {
          rel: "alternate",
          type: "application/atom+xml",
          href: `${APP_URL}/u/${params.username}/feed.atom`,
        },
      ],
    };
  },
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { user, groups, bookmarks, isLoggedIn } = Route.useLoaderData();
  return (
    <PublicProfileContent
      user={user}
      groups={groups}
      bookmarks={bookmarks}
      isLoggedIn={isLoggedIn}
    />
  );
}
