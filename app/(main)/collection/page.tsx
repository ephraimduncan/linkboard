import { redirect } from "next/navigation";
import { auth } from "~/lib/auth/validate-request";
import { api } from "~/trpc/server";
import { Search } from "../search";
import AddCollectionDialog from "./add-collection-dialog";
import { Collection } from "./collection";

type DashboardPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { user } = await auth();
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  if (!user) {
    redirect("/?unauthorized=true");
  }

  const collections = await api.collection.getUserCollections.query({
    search,
  });

  return (
    <div>
      <div className="flex gap-4 justify-between mx-auto">
        <Search route="/collection" search={search} />

        <AddCollectionDialog />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-xl font-semibold">Collections</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Collection key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}
