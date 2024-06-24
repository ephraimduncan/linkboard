"use client";

import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import { DropdownItem, DropdownLabel, DropdownMenu } from "~/components/primitives/dropdown";
import { logout } from "~/lib/auth/actions";

export function AccountDropdownMenu({ anchor }: { anchor: "top start" | "bottom end" }) {
  return (
    <DropdownMenu className="min-w-56 p-1 mx-auto" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownItem onClick={async () => await logout()}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Log out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}
