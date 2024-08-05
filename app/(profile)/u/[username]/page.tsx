import { Link } from "lucide-react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import { Avatar } from "~/components/primitives/avatar";
import { Button } from "~/components/primitives/button";
import {
  SidebarHeading,
  SidebarItem,
  SidebarSection,
} from "~/components/primitives/sidebar";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

type ProfilePageProps = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { user, bookmarks, collections } =
    await api.user.getUserBookmarksAndCollections.query({
      username: params.username,
    });

  if (!user) {
    notFound();
  }

  return (
    <div className="bg-stone-50">
      <div className="max-w-6xl mx-auto bg-stone-50 min-h-screen p-6 gap-x-8 flex">
        <div className="bg-stone-200 w-64 h-fit rounded-2xl p-4 space-y-4">
          <div className="flex gap-3">
            <Avatar square className="size-12" src={user.avatar} />
            <div className="flex flex-col gap-1">
              <div className="text-stone-900">{user.name}</div>

              <NextLink href={`/u/${user.username}`}>
                <div className="text-xs cursor-pointer bg-white text-stone-600 w-fit px-1 py-0.5 rounded-full">
                  @{user.username}
                </div>
              </NextLink>
            </div>
          </div>
          <div className="text-sm text-stone-600">
            Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </div>

          <div className="text-sm cursor-pointer text-stone-900 flex gap-1 items-center hover:underline">
            <Link className="w-3 h-3 stroke-2" />
            <span>duncan.land</span>
          </div>

          <div className="flex gap-2">
            <Button className="w-full">Follow</Button>
            <Button className="w-full" outline>
              Share
            </Button>
          </div>

          <SidebarSection className="!mt-6">
            <SidebarHeading>collections</SidebarHeading>
            {collections.items.map((event) => (
              <SidebarItem key={event.id} href={event.id}>
                {event.name}
              </SidebarItem>
            ))}
          </SidebarSection>
        </div>
        <div className="space-y-4">
          <h1 className="text-xl font-semibold mb-2 mx-3">bookmarks</h1>

          {bookmarks.items.length > 0 ? (
            <div>
              <BookmarkList
                route="user-profile"
                bookmarks={bookmarks.items as unknown as BookmarkWithTags[]}
              />
            </div>
          ) : (
            <EmptyState
              type="bookmark"
              title="This user has no bookmarks"
              description="This user has not added any bookmarks yet."
            />
          )}
        </div>
      </div>
    </div>
  );
}
