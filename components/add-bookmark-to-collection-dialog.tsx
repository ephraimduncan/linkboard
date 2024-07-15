"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { revalidateFromClient } from "~/app/revalidate-on-client";
import { Button } from "~/components/primitives/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "~/components/primitives/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/primitives/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/primitives/select";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/react";

const AddBookmarkToCollectionSchema = z.object({
  collectionId: z.string().min(1, "Please select a collection"),
});

type AddBookmarkToCollectionInput = z.infer<
  typeof AddBookmarkToCollectionSchema
>;

type AddBookmarkToCollectionDialogProps = {
  bookmark: BookmarkWithTags;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const AddBookmarkToCollectionDialog = ({
  bookmark,
  isOpen,
  setIsOpen,
}: AddBookmarkToCollectionDialogProps) => {
  const { data: collections, isLoading: isLoadingCollections } =
    api.collection.getUserCollections.useQuery({});
  const { mutateAsync: addBookmarkToCollection, isLoading: isAdding } =
    api.collection.addBookmark.useMutation();

  const form = useForm<AddBookmarkToCollectionInput>({
    resolver: zodResolver(AddBookmarkToCollectionSchema),
    defaultValues: {
      collectionId: "",
    },
  });

  const onSubmit = async (data: AddBookmarkToCollectionInput) => {
    try {
      await addBookmarkToCollection(
        {
          bookmarkId: bookmark.id,
          collectionId: data.collectionId,
        },
        {
          onSuccess: () => {
            revalidateFromClient("/dashboard");
            toast.success("Bookmark added to collection");
            setIsOpen(false);
          },
          onError: (error) => {
            throw error;
          },
        },
      );
    } catch (error) {
      if (error instanceof TRPCClientError) {
        return toast.error(error.message);
      }

      toast.error("Failed to add bookmark to collection");
    }
  };

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Add Bookmark to Collection</DialogTitle>
      <DialogBody>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="text-sm">
                        {field.value
                          ? collections?.find((c) => c.id === field.value)?.name
                          : "select a collection"}
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCollections ? (
                          <SelectItem value="">
                            Loading collections...
                          </SelectItem>
                        ) : collections && collections.length > 0 ? (
                          collections.map((collection) => (
                            <SelectItem
                              key={collection.id}
                              value={collection.id}
                            >
                              {collection.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="">
                            No collections available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          disabled={isAdding || isLoadingCollections}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isAdding && <Loader className="animate-spin size-4" />}
          {isAdding ? "Adding..." : "Add to Collection"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
