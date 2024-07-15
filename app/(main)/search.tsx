"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { Input, InputGroup } from "~/components/primitives/input";

type SearchProps = {
  search?: string;
  route: string;
  className?: string;
};

export function Search({ search, route, className }: SearchProps) {
  const router = useRouter();

  return (
    <InputGroup className={className}>
      <MagnifyingGlassIcon />
      <Input
        name="search"
        placeholder="Search&hellip;"
        aria-label="Search"
        defaultValue={search}
        onChange={(event) => {
          router.push(`/${route}/?search=${event.target.value}`);
        }}
      />
    </InputGroup>
  );
}
