"use client";
import { BookmarkIcon, SearchIcon, TagIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { ExploreIcon } from "~/components/icons/explore";
import { SidebarItem, SidebarLabel, SidebarSection } from "~/components/primitives/sidebar";

export function SidebarNavigation() {
  let pathname = usePathname();

  return (
    <>
      <SidebarSection>
        <SidebarItem href="/explore" current={pathname.startsWith("/explore")}>
          <ExploreIcon width={20} height={20} />
          <SidebarLabel>Explore</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/search" current={pathname.startsWith("/search")}>
          <SearchIcon width={20} height={20} />
          <SidebarLabel>Search</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/dashboard" current={pathname.startsWith("/dashboard")}>
          <BookmarkIcon width={20} height={20} />
          <SidebarLabel>Bookmarks</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/tags" current={pathname.startsWith("/tags")}>
          <TagIcon width={20} height={20} />
          <SidebarLabel>Tags</SidebarLabel>
        </SidebarItem>
      </SidebarSection>
    </>
  );
}
