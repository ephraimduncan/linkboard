"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { Input, InputGroup } from "~/components/primitives/input";

type SearchProps = { search?: string };

export function Search({ search }: SearchProps) {
  const router = useRouter();

  return (
    <InputGroup className="w-10/12">
      <MagnifyingGlassIcon />
      <Input
        name="search"
        placeholder="Search&hellip;"
        aria-label="Search"
        defaultValue={search}
        onChange={(event) => {
          router.push(`/dashboard/?search=${event.target.value}`);
        }}
      />
    </InputGroup>
  );
}
