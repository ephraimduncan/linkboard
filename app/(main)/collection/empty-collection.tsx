import { FolderIcon } from "~/components/icons/folder";
import { AddCollectionDialog } from "./add-collection-dialog";

export function EmptyCollection() {
  return (
    <div className="h-[calc(100vh-600px)] flex flex-1 items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-1 text-center">
        <FolderIcon className="size-16 mb-4" />
        <h3 className="text-xl font-medium tracking-tight">
          You have no collections
        </h3>
        <p className="text-sm text-muted-foreground">
          Collections help you organize your bookmarks by category or topic.{" "}
        </p>
        <AddCollectionDialog className="mt-4" icon={false}>
          Create collection
        </AddCollectionDialog>
      </div>
    </div>
  );
}
