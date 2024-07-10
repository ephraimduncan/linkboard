import {
  ContextMenu,
  ContextMenuTrigger,
} from "~/components/primitives/context-menu";
import { auth } from "~/lib/auth/validate-request";
import { truncateText } from "~/lib/utils";
import { BookmarkWithTags } from "~/server/db/schema";
import { BookmarkContextMenu } from "./bookmark-context-menu";

const addReferral = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append("ref", "linkboard.dev");
  return parsedUrl.toString();
};

type BookmarkListProps = { bookmarks: BookmarkWithTags[] };

export const BookmarkList = async ({ bookmarks }: BookmarkListProps) => {
  const { user } = await auth();

  // TODO: add an open lock to show public bookmarks
  // TODO: updated at date
  // TODO: seperate list for /discover and /dashboard

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div className="mb-3 hover:bg-stone-100 p-2 px-3 rounded-lg">
              <div className="flex items-center">
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
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <>
                    <span className="mr-2">
                      {bookmark.tags.map((t) => t.tag.name).join(", ")}
                    </span>
                    <span className="mr-2">•</span>
                  </>
                )}

                {bookmark.user?.username && (
                  <>
                    {/* TODO: redirect to users profile */}
                    <span className="mr-2 hover:underline cursor-pointer">
                      {bookmark.user.username}
                    </span>
                    <span className="mr-2">•</span>
                  </>
                )}
                <span>
                  {/* TODO: use updatedAt on discover page */}
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
          {/* TODO: Disable trigger for /discover */}
          {/* TODO: disable context menu for only bookmarks I can edit */}
          {user && <BookmarkContextMenu bookmark={bookmark} />}
        </ContextMenu>
      ))}
    </div>
  );
};
