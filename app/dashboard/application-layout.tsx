"use client";

import { Avatar } from "~/components/primitives/avatar";
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from "~/components/primitives/dropdown";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "~/components/primitives/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "~/components/primitives/sidebar";
import { SidebarLayout } from "~/components/primitives/sidebar-layout";
import { ArrowRightStartOnRectangleIcon, ChevronUpIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";
import { ExploreIcon } from "~/components/icons/explore";
import { SearchIcon } from "~/components/icons/search";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { TagIcon } from "~/components/icons/tag";

function AccountDropdownMenu({ anchor }: { anchor: "top start" | "bottom end" }) {
  return (
    <DropdownMenu className="min-w-56 p-1 mx-auto" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Log out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();

  return (
    <div className="bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src="/avatar.png" />
                </DropdownButton>
                <AccountDropdownMenu anchor="bottom end" />
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarBody>
              <SidebarSection className="mt-4">
                <SidebarLabel className="text-xl px-2 font-sans cursor-pointer">linkboard</SidebarLabel>
              </SidebarSection>

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

              <SidebarSpacer />

              <SidebarSection className="max-lg:hidden">
                <Dropdown>
                  <DropdownButton as={SidebarItem}>
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar src="/avatar.png" className="size-10" alt="" />

                      <span className="min-w-0">
                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                          Duncan
                        </span>
                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                          duncan@example.com
                        </span>
                      </span>
                    </span>
                    <ChevronUpIcon />
                  </DropdownButton>
                  <AccountDropdownMenu anchor="top start" />
                </Dropdown>
              </SidebarSection>
            </SidebarBody>
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
    </div>
  );
}
