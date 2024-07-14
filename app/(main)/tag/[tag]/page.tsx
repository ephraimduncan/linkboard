import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { EmptyBookmark } from "../../dashboard/empty-bookmark";
import { BookmarkList } from "./bookmark-list";

type TagPageProps = {
  params: { tag: string };
};

export default async function TagPage({ params }: TagPageProps) {
  const bookmarks = await api.bookmark.getBookmarksByTag.query({
    tagName: params.tag,
  });

  console.log(
    bookmarks.forEach((bookmark) =>
      console.log(bookmark.tags.map((tag) => tag.name)),
    ),
  );

  return (
    <div>
      {/* <div className="flex gap-4 mx-auto">
        <Search route="discover" search={search} className="w-full" />
      </div> */}
      {bookmarks.length > 0 ? (
        <div className="mt-8">
          <BookmarkList
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        </div>
      ) : (
        <EmptyBookmark />
      )}
    </div>
  );
}
