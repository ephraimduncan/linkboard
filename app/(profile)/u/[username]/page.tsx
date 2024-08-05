import NextLink from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { Login } from "~/app/(landing)/login";
import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import { Avatar } from "~/components/primitives/avatar";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
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

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const perPage = 20;
  const page =
    typeof searchParams.page === "string" && +searchParams.page > 0
      ? +searchParams.page
      : 1;

  const totalPages = Math.ceil(bookmarks.total / perPage);

  return (
    <div className="bg-stone-50">
      <div className="max-w-5xl mx-auto min-h-screen p-8 pt-10 gap-y-8">
        <div className="flex items-center justify-between !mb-6">
          <h1 className="text-2xl font-sans">
            <Balancer>linkboard</Balancer>
          </h1>

          <div className="flex gap-5 text-lg items-end justify-end">
            {user ? (
              <NextLink href="/dashboard">Dashboard</NextLink>
            ) : (
              <Login />
            )}
            <NextLink href="/discover">discover</NextLink>
          </div>
        </div>

        <div className="gap-x-8 flex">
          <div className="bg-stone-200 w-80 h-fit rounded-2xl p-2 space-y-4">
            {user.name ? (
              <div className="flex gap-3 p-2">
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
            ) : (
              <div className="flex gap-3 p-2">
                <Avatar square className="size-12" src={user.avatar} />
                <div className="flex flex-col gap-1">
                  <NextLink href={`/u/${user.username}`}>
                    <div className="text-sm cursor-pointer bg-white text-stone-600 w-fit px-1 py-0.5 rounded-full">
                      <div className="text-stone-900">@{user.username}</div>
                    </div>
                  </NextLink>
                </div>
              </div>
            )}

            {user.bio && (
              <div className="text-sm text-stone-600 px-2">{user?.bio}</div>
            )}

            {/* Portfolio link is disabled for now */}
            {/* <div className="text-sm px-2 cursor-pointer text-stone-900 flex gap-1 items-center hover:underline">
              <Link className="w-3 h-3 stroke-2" />
              <span>duncan.land</span>
            </div> */}

            {/* Follow button is disabled for now */}
            {/* <div className="flex gap-2 px-2">
              <Button className="w-full">Follow</Button>
              <Button className="w-full" outline>
                Share
              </Button>
            </div> */}

            {collections.items.length > 0 && (
              <SidebarSection className="!mt-4">
                <SidebarHeading>collections</SidebarHeading>
                {collections.items.map((event) => (
                  <SidebarItem key={event.id} href={event.id}>
                    {event.name}
                  </SidebarItem>
                ))}
              </SidebarSection>
            )}
          </div>
          <div className="space-y-4 w-full">
            <h1 className="text-xl font-semibold mb-2 mx-3">bookmarks</h1>

            {bookmarks.items.length > 0 ? (
              <div>
                <BookmarkList
                  route="user-profile"
                  bookmarks={bookmarks.items as unknown as BookmarkWithTags[]}
                />

                <div className="mt-10 mx-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-semibold">
                      {(page - 1) * perPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {Math.min(page * perPage, bookmarks.total)}
                    </span>{" "}
                    of <span className="font-semibold">{bookmarks.total}</span>{" "}
                    bookmarks
                  </p>
                  <Pagination>
                    <PaginationPrevious
                      href={
                        page > 1
                          ? `/dashboard?page=${page - 1}${
                              search ? `&search=${search}` : ""
                            }`
                          : undefined
                      }
                    />
                    <PaginationNext
                      href={
                        page < totalPages
                          ? `/dashboard?page=${page + 1}${
                              search ? `&search=${search}` : ""
                            }`
                          : undefined
                      }
                    />
                  </Pagination>
                </div>
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
    </div>
  );
}
