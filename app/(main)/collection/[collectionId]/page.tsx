import { redirect } from "next/navigation";
import { auth } from "~/lib/auth/validate-request";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { BookmarkList } from "../../dashboard/bookmark-list";
import { Search } from "../../search";
import { CollectionDialogGroup } from "./dialog-group";
import { EmptyBookmark } from "./empty-bookmark";

type CollectionPageProps = {
  params: { collectionId: string };

  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { user } = await auth();
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  if (!user) {
    redirect("/?unauthorized=true");
  }

  const collection = await api.collection.get.query({
    id: params.collectionId,
  });
  const bookmarks = collection.bookmarks.map((bookmark) => bookmark.bookmark);

  return (
    <div>
      <div className="flex gap-4 justify-between mx-auto">
        <Search route="/collection" search={search} />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between mb-2 mx-3">
          <h1 className="text-xl font-semibold">{collection.name}</h1>

          <div className="flex gap-2 items-center">
            <CollectionDialogGroup collection={collection} />
          </div>
        </div>

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
    </div>
  );
}
