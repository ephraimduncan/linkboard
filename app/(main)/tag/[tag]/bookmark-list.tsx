import { BookmarkContextMenu } from "~/components/bookmark-context-menu";
import { LockOpen } from "~/components/icons/lock-open";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "~/components/primitives/context-menu";
import { auth } from "~/lib/auth/validate-request";
import { getUrlWithPath, truncateText } from "~/lib/utils";
import { BookmarkWithTags } from "~/server/db/schema";

const addReferral = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append("ref", "linkboard.dev");
  return parsedUrl.toString();
};

type BookmarkListProps = { bookmarks: BookmarkWithTags[] };

export const BookmarkList = async ({ bookmarks }: BookmarkListProps) => {
  const { user } = await auth();

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div className="mb-3 hover:bg-stone-100 py-2 rounded-lg">
              <div className="flex items-center">
                {/* TODO: Tooltip to indicate its public */}
                {bookmark.isPublic && (
                  <LockOpen className="size-4 text-muted-foreground mr-1" />
                )}
                {bookmark.title ? (
                  <>
                    <a
                      href={addReferral(bookmark.url)}
                      className="font-medium text-black hover:underline mr-2"
                    >
                      {truncateText(bookmark.title)}
                    </a>
                    <a href={addReferral(bookmark.url)}>
                      <span className="text-sm text-muted-foreground">
                        ({new URL(bookmark.url).hostname})
                      </span>
                    </a>
                  </>
                ) : (
                  <a
                    href={addReferral(bookmark.url)}
                    className="font-medium text-black hover:underline mr-2"
                  >
                    {truncateText(getUrlWithPath({ bookmark }))}
                  </a>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span>
                  {new Date(bookmark.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          {user && <BookmarkContextMenu bookmark={bookmark} />}
        </ContextMenu>
      ))}
    </div>
  );
};
