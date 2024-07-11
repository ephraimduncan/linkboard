import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "~/components/primitives/input";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { BookmarkList } from "./bookmark-list";
import { EmptyDiscover } from "./empty-discover";

export default async function DiscoverPage() {
  const bookmarks = await api.bookmark.getPublicBookmarks.query({});

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

      {bookmarks.length > 0 ? (
        <div className="mt-8">
          <BookmarkList
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        </div>
      ) : (
        <EmptyDiscover />
      )}
    </div>
  );
}
