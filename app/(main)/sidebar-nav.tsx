"use client";
import { SearchIcon, TagIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { Sparkle } from "~/components/icons/sparkle";
import {
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "~/components/primitives/sidebar";
import { User } from "~/server/db/schema";

type SideNavigationProps = {
  user: User | null;
};

export function SidebarNavigation({ user }: SideNavigationProps) {
  let pathname = usePathname();

  return (
    <>
      <SidebarSection>
        <SidebarItem
          href="/discover"
          current={pathname.startsWith("/discover")}
        >
          <Sparkle className="size-5" />
          <SidebarLabel>Discover</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/search" current={pathname.startsWith("/search")}>
          <SearchIcon width={20} height={20} />
          <SidebarLabel>Search</SidebarLabel>
        </SidebarItem>
        {user && (
          <>
            <SidebarItem
              href="/dashboard"
              current={pathname.startsWith("/dashboard")}
            >
              <BookmarkIcon width={20} height={20} />
              <SidebarLabel>Bookmarks</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/tags" current={pathname.startsWith("/tags")}>
              <TagIcon width={20} height={20} />
              <SidebarLabel>Tags</SidebarLabel>
            </SidebarItem>
          </>
        )}
      </SidebarSection>
    </>
  );
}
