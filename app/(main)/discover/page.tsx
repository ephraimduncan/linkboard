import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { NoSearchResults } from "../dashboard/empty-bookmark";
import { Search } from "../search";
import { BookmarkList } from "./bookmark-list";
import { EmptyDiscover } from "./empty-discover";

type DiscoverPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const perPage = 20;
  const page =
    typeof searchParams.page === "string" && +searchParams.page > 0
      ? +searchParams.page
      : 1;

  const { bookmarks, totalBookmarks } =
    await api.bookmark.getPublicBookmarks.query({
      search,
      page,
      perPage,
    });

  const totalPages = Math.ceil(totalBookmarks / perPage);

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <Search route="/discover" search={search} />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-xl font-semibold mb-2 mx-3">discover</h1>

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
                      ? `/discover?page=${page - 1}${
                          search ? `&search=${search}` : ""
                        }`
                      : undefined
                  }
                />
                <PaginationNext
                  href={
                    page < totalPages
                      ? `/discover?page=${page + 1}${
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
          <EmptyDiscover />
        )}
      </div>
    </div>
  );
}
