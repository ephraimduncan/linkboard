import {
  ContextMenu,
  ContextMenuTrigger,
} from "~/components/primitives/context-menu";
import { Link } from "~/components/primitives/link";
import { getUrlWithPath, truncateText } from "~/lib/utils";
import { BookmarkWithTags } from "~/server/db/schema";

const addReferral = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append("ref", "linkboard.dev");
  return parsedUrl.toString();
};

type BookmarkListProps = { bookmarks: BookmarkWithTags[] };

export const BookmarkList = async ({ bookmarks }: BookmarkListProps) => {
  return (
    <div>
      {bookmarks.map((bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div className="mb-3 hover:bg-stone-100 p-2 px-3 rounded-lg">
              <div className="flex items-center">
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
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <>
                    {bookmark.tags.map((tag) => (
                      <Link href={`/tag/${tag.tag.name}`} key={tag.tag.id}>
                        <span className="mr-2 cursor-pointer hover:underline">
                          {tag.tag.name}
                        </span>
                      </Link>
                    ))}

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
                  {new Date(bookmark.updatedAt).toLocaleString("en-US", {
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
          {/* TODO: enable context menu for only bookmarks I can edit */}
          {/* {user && <BookmarkContextMenu bookmark={bookmark} />} */}
        </ContextMenu>
      ))}
    </div>
  );
};
