import { redirect } from "next/navigation";
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

  const bookmarks = await api.bookmark.myBookmarks.query({
    search,
  });

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <Search route="dashboard" search={search} />

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
