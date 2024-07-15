import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { EmptyBookmark } from "../../dashboard/empty-bookmark";
import { Search } from "../../search";
import { BookmarkList } from "./bookmark-list";

type TagPageProps = {
  params: { tag: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const bookmarks = await api.bookmark.getBookmarksByTag.query({
    tagName: params.tag,
    search,
  });

  return (
    <div className="space-y-8">
      <div className="flex gap-4 mx-auto">
        <Search route={"tag/" + params.tag} search={search} />
      </div>

      <div>
        <h1 className="text-xl font-semibold mb-2 mx-3">{params.tag}</h1>

        {bookmarks.length > 0 ? (
          <BookmarkList
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        ) : (
          <EmptyBookmark />
        )}
      </div>
    </div>
  );
}
