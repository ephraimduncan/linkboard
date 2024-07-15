import { redirect } from "next/navigation";
import { auth } from "~/lib/auth/validate-request";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { BookmarkList } from "../../dashboard/bookmark-list";
import { Search } from "../../search";

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

  console.log(
    bookmarks,
    bookmarks.map((bookmark) => bookmark.tags),
  );

  return (
    <div>
      <div className="flex gap-4 justify-between mx-auto">
        <Search route="/collection" search={search} />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-xl font-semibold mb-2 mx-3">{collection.name}</h1>
        <div className="mt-8">
          <BookmarkList
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        </div>
      </div>
    </div>
  );
}
