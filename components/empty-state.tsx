import { AddBookmarkIcon } from "~/components/icons/add-bookmark";
import { FolderIcon } from "~/components/icons/folder";
import { ListSearch } from "~/components/icons/list-search";
import { Sparkle } from "~/components/icons/sparkle";
import { AddCollectionDialog } from "./add-collection-dialog";
import { AddLinkDialog } from "./add-link-dialog";

interface EmptyStateProps {
  type:
    | "bookmark"
    | "search"
    | "discover"
    | "collection"
    | "collectionBookmark";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    dialog?: "addLink" | "addCollection";
  };
  className?: string;
}

const icons = {
  bookmark: AddBookmarkIcon,
  search: ListSearch,
  discover: Sparkle,
  collection: FolderIcon,
  collectionBookmark: AddBookmarkIcon,
};

export function EmptyState({
  type,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const Icon = icons[type];

  const containerClasses = {
    bookmark: "mt-8 h-[calc(100vh-500px)]",
    search: "mt-8 h-[calc(100vh-400px)]",
    discover: "mt-8 h-[calc(100vh-180px)] border border-dashed shadow",
    collection: "h-[calc(100vh-600px)]",
    collectionBookmark: "h-[calc(100vh-600px)]",
  };

  const ActionComponent =
    action?.dialog === "addLink"
      ? AddLinkDialog
      : action?.dialog === "addCollection"
        ? AddCollectionDialog
        : null;

  return (
    <div
      className={`${containerClasses[type]} flex flex-1 items-center justify-center rounded-lg ${className}`}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <Icon
          className="size-16 mb-4"
          strokeWidth={type === "discover" ? 1.5 : undefined}
        />
        <h3 className="text-xl font-medium tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action &&
          (ActionComponent ? (
            <ActionComponent className="mt-4" icon={false}>
              {action.label}
            </ActionComponent>
          ) : (
            <button className="mt-4" onClick={action.onClick}>
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );
}
