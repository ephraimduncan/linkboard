import { Input, InputGroup } from "~/components/primitives/input";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "~/components/primitives/button";
import { BookmarkList } from "~/components/bookmark-list";
import { getBookmarks } from "~/sample-data";
import { AddLinkDialog } from "./add-link-dialog";

export default async function DashboardPage() {
  const bookmarks = getBookmarks();

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <InputGroup className="w-10/12">
          <MagnifyingGlassIcon />
          <Input name="search" placeholder="Search&hellip;" aria-label="Search" />
        </InputGroup>
        <AddLinkDialog />
      </div>

      <div className="mt-8">
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </div>
  );
}
