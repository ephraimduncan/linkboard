import React from "react";
import { truncateText } from "~/lib/utils";
import { ContextMenu, ContextMenuTrigger } from "~/components/primitives/context-menu";
import { BookmarkContextMenu } from "./bookmark-context-menu";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  isPublic: boolean;
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

const addReferral = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append("ref", "linkboard.dev");
  return parsedUrl.toString();
};

export const BookmarkList = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
  return (
    <div>
      {bookmarks.map((bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div className="mb-3 hover:bg-gray-100 p-2 px-3 rounded-lg">
              <div className="flex items-center">
                <a href={addReferral(bookmark.url)} className="font-medium text-black hover:underline mr-2">
                  {truncateText(bookmark.title)}
                </a>
                <a href={addReferral(bookmark.url)}>
                  <span className="text-sm text-muted-foreground">({new URL(bookmark.url).hostname})</span>
                </a>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <>
                    <span className="mr-2">{bookmark.tags?.map((tag) => tag.tag.name).join(", ")}</span>
                    <span className="mr-2">•</span>
                  </>
                )}

                {/* {bookmark.username && (
              <>
                <span className="mr-2">{bookmark.username}</span>
                <span className="mr-2">•</span>
              </>
            )} */}
                <span>
                  {new Date(bookmark.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <BookmarkContextMenu bookmark={bookmark} />
        </ContextMenu>
      ))}
    </div>
  );
};
