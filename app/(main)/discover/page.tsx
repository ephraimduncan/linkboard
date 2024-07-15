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

  const bookmarks = await api.bookmark.getPublicBookmarks.query({
    search,
  });

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
