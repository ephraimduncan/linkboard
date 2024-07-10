import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { BookmarkList } from "~/components/bookmark-list";
import { Input, InputGroup } from "~/components/primitives/input";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { AddLinkDialog } from "./add-link-dialog";

export default async function DashboardPage() {
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

      <div className="mt-8">
        <BookmarkList bookmarks={bookmarks as unknown as BookmarkWithTags[]} />
      </div>
    </div>
  );
}
