import { AddBookmarkIcon } from "~/components/icons/add-bookmark";
import { ListSearch } from "~/components/icons/list-search";
import { AddLinkDialog } from "./add-link-dialog";

export function EmptyBookmark() {
  return (
    <div className="mt-8 h-[calc(100vh-500px)] flex flex-1 items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-1 text-center">
        <AddBookmarkIcon className="size-16 mb-4" />
        <h3 className="text-xl font-medium tracking-tight">
          You have no bookmarks
        </h3>
        <p className="text-sm text-muted-foreground">
          Start saving your favorite websites and they&apos;ll appear here.
        </p>
        <AddLinkDialog className="mt-4" icon={false}>
          Add bookmark
        </AddLinkDialog>
      </div>
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="mt-8 h-[calc(100vh-400px)] flex flex-1 items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-1 text-center">
        <ListSearch className="size-16 mb-4" />
        <h3 className="text-xl font-medium tracking-tight">
          No bookmarks found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try searching for something else.
        </p>
      </div>
    </div>
  );
}
