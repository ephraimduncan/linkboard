import { AddBookmarkIcon } from "~/components/icons/add-bookmark";
import { AddLinkDialog } from "../../dashboard/add-link-dialog";

export function EmptyBookmark() {
  return (
    <div className="h-[calc(100vh-600px)] flex flex-1 items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-1 text-center">
        <AddBookmarkIcon className="size-16 mb-4" />
        <h3 className="text-xl font-medium tracking-tight">
          You have no bookmarks in this collection
        </h3>
        <p className="text-sm text-muted-foreground">
          Add a bookmark to this collection to see it here.
        </p>
        {/* Add bookmark to this collection */}
        <AddLinkDialog className="mt-4" icon={false}>
          Add bookmark
        </AddLinkDialog>
      </div>
    </div>
  );
}
