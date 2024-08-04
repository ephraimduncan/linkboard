"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "~/components/primitives/alert";
import { Button } from "~/components/primitives/button";
import { api } from "~/trpc/react";

type DeleteCollectionDialogProps = {
  collectionId: string;
  collectionName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const DeleteCollectionDialog: React.FC<DeleteCollectionDialogProps> = ({
  collectionId,
  collectionName,
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter();

  const { mutateAsync: deleteCollection, isLoading: isDeletingCollection } =
    api.collection.delete.useMutation({
      onSuccess: () => {
        router.push("/dashboard");
        toast.success("Collection deleted");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to delete collection");
      },
    });

  const handleDelete = async () => {
    await deleteCollection({ id: collectionId });
    setIsOpen(false);
  };

  return (
    <Alert open={isOpen} onClose={() => setIsOpen(false)}>
      <AlertTitle>Are you sure you want to delete this collection?</AlertTitle>
      <AlertDescription>
        This action cannot be undone. All bookmarks in this collection will be
        removed from it.
      </AlertDescription>
      <AlertActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button disabled={isDeletingCollection} onClick={handleDelete}>
          {isDeletingCollection && <Loader className="animate-spin size-4" />}
          Delete
        </Button>
      </AlertActions>
    </Alert>
  );
};
