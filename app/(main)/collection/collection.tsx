import { Avatar } from "~/components/primitives/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/primitives/card";
import { Link } from "~/components/primitives/link";
import { truncateText } from "~/lib/utils";
import type { Collection as CollectionType } from "~/server/db/schema";

const avatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

export function Collection({ collection }: { collection: CollectionType }) {
  return (
    <Link href={`/collection/${collection.id}`}>
      <Card className="h-40 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="!text-lg">{collection.name}</CardTitle>
          <CardDescription className="!mt-1">
            {truncateText(collection.description ?? "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex -space-x-2">
            {avatars.map((avatarUrl) => (
              <Avatar
                key={avatarUrl}
                src={avatarUrl}
                className="size-8 ring-2 ring-white dark:ring-stone-900"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
