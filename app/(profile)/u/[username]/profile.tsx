import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "~/components/primitives/avatar";
import {
  SidebarHeading,
  SidebarItem,
  SidebarSection,
} from "~/components/primitives/sidebar";
import { api } from "~/trpc/server";

type ProfileProps = {
  children: React.ReactNode;
  username: string;
};

export default async function Profile({ username, children }: ProfileProps) {
  const { user, collections } =
    await api.user.getUserBookmarksAndCollections.query({
      username: username,
    });

  if (!user) {
    notFound();
  }

  return (
    <div className="gap-x-8 flex">
      <div className="bg-stone-200 w-80 h-fit rounded-2xl p-2 space-y-4">
        {user.name ? (
          <div className="flex gap-3 p-2">
            <Avatar square className="size-12" src={user.avatar} />
            <div className="flex flex-col gap-1">
              <div className="text-stone-900">{user.name}</div>

              <NextLink href={`/u/${user.username}`}>
                <div className="text-xs cursor-pointer bg-white text-stone-600 w-fit px-1 py-0.5 rounded-full">
                  @{user.username}
                </div>
              </NextLink>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 p-2">
            <Avatar square className="size-12" src={user.avatar} />
            <div className="flex flex-col gap-1">
              <NextLink href={`/u/${user.username}`}>
                <div className="text-sm cursor-pointer bg-white text-stone-600 w-fit px-1 py-0.5 rounded-full">
                  <div className="text-stone-900">@{user.username}</div>
                </div>
              </NextLink>
            </div>
          </div>
        )}

        {user.bio && (
          <div className="text-sm text-stone-600 px-2">{user?.bio}</div>
        )}

        {/* Portfolio link is disabled for now */}
        {/* <div className="text-sm px-2 cursor-pointer text-stone-900 flex gap-1 items-center hover:underline">
              <Link className="w-3 h-3 stroke-2" />
              <span>duncan.land</span>
            </div> */}

        {/* Follow button is disabled for now */}
        {/* <div className="flex gap-2 px-2">
              <Button className="w-full">Follow</Button>
              <Button className="w-full" outline>
                Share
              </Button>
            </div> */}

        {collections.items.length > 0 && (
          <SidebarSection className="!mt-4">
            <SidebarHeading>collections</SidebarHeading>
            {collections.items.map((collection) => (
              <SidebarItem
                key={collection.id}
                href={`/u/${user.username}/collection/${collection.id}`}
              >
                {collection.name}
              </SidebarItem>
            ))}
          </SidebarSection>
        )}
      </div>

      {children}
    </div>
  );
}
