import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { Avatar } from "~/components/primitives/avatar";
import { Dropdown, DropdownButton } from "~/components/primitives/dropdown";
import { Link } from "~/components/primitives/link";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "~/components/primitives/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "~/components/primitives/sidebar";
import { SidebarLayout } from "~/components/primitives/sidebar-layout";
import { auth } from "~/lib/auth/validate-request";
import { AccountDropdownMenu } from "./dashboard/accout-dropdown";
import { Login } from "./login-dialog";
import { SidebarNavigation } from "./sidebar-nav";

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const { user } = await auth();

  return (
    <div className="max-lg:flex-col">
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              {user ? (
                <Dropdown>
                  <DropdownButton as={NavbarItem}>
                    <Avatar src={user.avatar} />
                  </DropdownButton>
                  <AccountDropdownMenu user={user} anchor="bottom end" />
                </Dropdown>
              ) : (
                <Login />
              )}
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarBody>
              <SidebarSection className="mt-4">
                <Link href="/">
                  <SidebarLabel className="text-xl px-2 font-sans cursor-pointer">
                    linkboard
                  </SidebarLabel>
                </Link>
              </SidebarSection>

              <SidebarNavigation user={user} />

              <SidebarSpacer />

              <SidebarSection className="max-lg:hidden">
                {user ? (
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
                ) : (
                  <Login />
                )}
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
