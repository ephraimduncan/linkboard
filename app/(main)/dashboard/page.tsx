import { redirect } from "next/navigation";
import { auth } from "~/lib/auth/validate-request";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { AddLinkDialog } from "./add-link-dialog";
import { BookmarkList } from "./bookmark-list";
import { EmptyBookmark, NoSearchResults } from "./empty-bookmark";
import { Search } from "./search";

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

  const bookmarks = await api.bookmark.myBookmarks.query({
    search,
  });

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <Search search={search} />

        <AddLinkDialog />
      </div>

      {bookmarks.length > 0 ? (
        <div className="mt-8">
          <BookmarkList
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        </div>
      ) : search ? (
        <NoSearchResults />
      ) : (
        <EmptyBookmark />
      )}
    </div>
  );
}
