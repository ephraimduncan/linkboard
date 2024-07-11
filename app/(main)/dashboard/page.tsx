import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { redirect } from "next/navigation";
import { Input, InputGroup } from "~/components/primitives/input";
import { auth } from "~/lib/auth/validate-request";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { AddLinkDialog } from "./add-link-dialog";
import { BookmarkList } from "./bookmark-list";
import { EmptyBookmark } from "./empty-bookmark";

export default async function DashboardPage() {
  const { user } = await auth();

  if (!user) {
    redirect("/?unauthorized=true");
  }

  const bookmarks = await api.bookmark.myBookmarks.query({});

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <InputGroup className="w-10/12">
          <MagnifyingGlassIcon />
          <Input
            name="search"
            placeholder="Search&hellip;"
            aria-label="Search"
          />
        </InputGroup>
        <AddLinkDialog />
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
  );
}
