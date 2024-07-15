"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { Input, InputGroup } from "~/components/primitives/input";

type SearchProps = {
  search?: string;
  route: string;
};

export function Search({ search, route }: SearchProps) {
  const router = useRouter();

  return (
    <InputGroup className="w-full mb-2 mx-3">
      <MagnifyingGlassIcon />
      <Input
        name="search"
        placeholder="search&hellip;"
        aria-label="Search"
        defaultValue={search}
        onChange={(event) => {
          router.push(`/${route}/?search=${event.target.value}`);
        }}
      />
    </InputGroup>
  );
}
