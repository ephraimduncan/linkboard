import { Avatar } from "~/components/primitives/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/primitives/card";
import { Link } from "~/components/primitives/link";
import { truncateText } from "~/lib/utils";
import type { CollectionWithBookmark } from "~/server/db/schema";

export function Collection({
  collection,
}: { collection: CollectionWithBookmark }) {
  return (
    <Link href={`/collection/${collection.id}`}>
      <Card className="h-40 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="!text-lg">{collection.name}</CardTitle>
          <CardDescription className="!mt-1">
            {truncateText(collection.description ?? "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex -space-x-2">
            {!collection.bookmarks.length && <span>No bookmarks yet</span>}

            {collection.bookmarks.map((bookmark) =>
              bookmark.bookmark.favicon ? (
                <Avatar
                  key={bookmark.bookmark.id}
                  src={bookmark.bookmark.favicon}
                  className="size-7 ring-1 shadow bg-white dark:ring-white ring-stone-900"
                />
              ) : (
                <Avatar
                  key={bookmark.bookmark.id}
                  initials={
                    bookmark.bookmark?.title[0] ??
                    new URL(bookmark.bookmark.url).hostname[0]
                  }
                  className="size-7 ring-1 shadow bg-white dark:ring-white ring-stone-900"
                />
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
