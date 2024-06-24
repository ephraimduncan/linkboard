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
import { SidebarNavigation } from "./sidebar-nav";
import { auth } from "~/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { logout } from "~/lib/auth/actions";
import { Button } from "~/components/primitives/button";
import { AccountDropdownMenu } from "./accout-dropdown";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src={user.avatar} />
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

              <SidebarNavigation />

              <SidebarSpacer />

              <SidebarSection className="max-lg:hidden">
                <Dropdown>
                  <DropdownButton as={SidebarItem}>
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar src={user.avatar} className="size-10" alt="" />

                      <span className="min-w-0">
                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                          duncan
                        </span>
                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                          {user.email}
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
