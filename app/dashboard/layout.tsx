import { Avatar } from "~/components/primitives/avatar";
import { Dropdown, DropdownButton } from "~/components/primitives/dropdown";
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
import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { SidebarNavigation } from "./sidebar-nav";
import { auth } from "~/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { AccountDropdownMenu } from "./accout-dropdown";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-white max-lg:flex-col">
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src={user.avatar} />
                </DropdownButton>
                <AccountDropdownMenu user={user} anchor="bottom end" />
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
                        <span className="block truncate text-sm/5 !lowercase font-medium text-stone-950 dark:text-white">
                          {user.name}
                        </span>
                        <span className="block truncate text-xs/5 font-normal !lowercase text-stone-500 dark:text-stone-400">
                          {user.email}
                        </span>
                      </span>
                    </span>
                    <ChevronUpIcon />
                  </DropdownButton>
                  <AccountDropdownMenu user={user} anchor="top start" />
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
