import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { BookmarkList } from "~/components/bookmark-list";
import { Input, InputGroup } from "~/components/primitives/input";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const bookmarks = await api.bookmark.getPublicBookmarks.query({});

  console.log(bookmarks);

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <InputGroup className="w-full">
          <MagnifyingGlassIcon />
          <Input
            name="search"
            placeholder="Search in Public Bookmarks&hellip;"
            aria-label="Search"
          />
        </InputGroup>
      </div>

      <div className="mt-8">
        <BookmarkList bookmarks={bookmarks as unknown as BookmarkWithTags[]} />
      </div>
    </div>
  );
}
