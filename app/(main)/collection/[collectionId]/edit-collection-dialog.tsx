import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { revalidateFromClient } from "~/app/revalidate-on-client";
import { Button } from "~/components/primitives/button";
import { Checkbox, CheckboxField } from "~/components/primitives/checkbox";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "~/components/primitives/dialog";
import { Label } from "~/components/primitives/fieldset";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/primitives/form";
import { Input } from "~/components/primitives/input";
import {
  UpdateCollectionInput,
  UpdateCollectionSchema,
} from "~/server/api/routers/collection/collection.input";
import { Collection } from "~/server/db/schema";
import { api } from "~/trpc/react";

type EditCollectionDialogProps = {
  collection: Collection;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const EditCollectionDialog: React.FC<EditCollectionDialogProps> = ({
  collection,
  isOpen,
  setIsOpen,
}) => {
  const { mutateAsync: updateCollection, isLoading } =
    api.collection.update.useMutation({
      onSuccess: () => {
        revalidateFromClient("/dashboard");
        toast.success("Collection updated");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to update collection");
      },
    });

  const form = useForm<UpdateCollectionInput>({
    resolver: zodResolver(UpdateCollectionSchema),
    defaultValues: {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "",
      isPublic: collection.isPublic,
    },
  });

  const onSubmit = async (data: UpdateCollectionInput) => {
    await updateCollection(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Edit Collection</DialogTitle>

      <DialogBody>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} name="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="description"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <CheckboxField>
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        name="isPublic"
                      />
                      <Label>Make collection public</Label>
                    </CheckboxField>
                  </FormControl>
                  <FormDescription>
                    Public collections are visible to others
                  </FormDescription>
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
        <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
          {isLoading && <Loader className="animate-spin size-4" />}
          {isLoading ? "Updating..." : "Update collection"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
