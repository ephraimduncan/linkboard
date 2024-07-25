import { redirect } from "next/navigation";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
import { auth } from "~/lib/auth/validate-request";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { Search } from "../search";
import { AddLinkDialog } from "./add-link-dialog";
import { BookmarkList } from "./bookmark-list";
import { EmptyBookmark, NoSearchResults } from "./empty-bookmark";

type DashboardPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { user } = await auth();
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  if (!user) {
    redirect("/?unauthorized=true");
  }

  const perPage = 20;
  const page =
    typeof searchParams.page === "string" && +searchParams.page > 0
      ? +searchParams.page
      : 1;

  const { bookmarks, totalBookmarks } = await api.bookmark.myBookmarks.query({
    search,
    page,
    perPage,
  });

  const totalPages = Math.ceil(totalBookmarks / perPage);

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <Search route="/dashboard" search={search} />

        <AddLinkDialog />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-xl font-semibold mb-2 mx-3">bookmarks</h1>

        {bookmarks.length > 0 ? (
          <div>
            <BookmarkList
              bookmarks={bookmarks as unknown as BookmarkWithTags[]}
            />
            <div className="mt-10 mx-3 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(page * perPage, totalBookmarks)}
                </span>{" "}
                of <span className="font-semibold">{totalBookmarks}</span>{" "}
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
        ) : search ? (
          <NoSearchResults />
        ) : (
          <EmptyBookmark />
        )}
      </div>
    </div>
  );
}
