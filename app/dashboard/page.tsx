import { Input, InputGroup } from "~/components/primitives/input";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import { BookmarkList } from "~/components/bookmark-list";
import { AddLinkDialog } from "./add-link-dialog";
import { api } from "~/trpc/server";

// remove this
type Bookmark = {
  id: number;
  title: string;
  url: string;
  description: string;
  tags?: {
    tag: {
      createdAt: Date;
      updatedAt: Date;
      id: string;
      name: string;
    };
  }[];
  createdAt: string;
  //   username?: string;
};

export default async function DashboardPage() {
  const bookmarks = await api.bookmark.myBookmarks.query({});

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
        <BookmarkList bookmarks={bookmarks as unknown as Bookmark[]} />
      </div>
    </div>
  );
}
