"use client";

import { useState } from "react";
import { DeleteCollectionDialog } from "~/components/delete-collection-dialog";
import { EditCollectionDialog } from "~/components/edit-collection-dialog";
import { Pencil } from "~/components/icons/pencil";
import { Trash } from "~/components/icons/trash";
import { Button } from "~/components/primitives/button";
import { Collection } from "~/server/db/schema";

type CollectionDialogGroupProps = {
  collection: Collection;
};

export function CollectionDialogGroup({
  collection,
}: CollectionDialogGroupProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Button plain onClick={() => setIsDeleteDialogOpen(true)}>
        <Trash className="size-5" />
      </Button>
      <Button plain onClick={() => setIsEditDialogOpen(true)}>
        <Pencil className="size-5" />
      </Button>

      <DeleteCollectionDialog
        collectionId={collection.id}
        collectionName={collection.name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />

      <EditCollectionDialog
        collection={collection}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
    </>
  );
}
