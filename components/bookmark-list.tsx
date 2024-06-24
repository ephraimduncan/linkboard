import React from "react";

type Bookmark = {
  id: number;
  title: string;
  url: string;
  description: string;
  tags?: string[];
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
        <div key={bookmark.id} className="mb-5">
          <div className="flex items-center">
            <a href={addReferral(bookmark.url)} className="font-medium text-black hover:underline mr-2">
              {bookmark.title}
            </a>
            <a href={addReferral(bookmark.url)}>
              <span className="text-sm text-muted-foreground">({new URL(bookmark.url).hostname})</span>
            </a>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {bookmark.tags && (
              <>
                <span className="mr-2">{bookmark.tags.join(", ")}</span>
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
              })}{" "}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
