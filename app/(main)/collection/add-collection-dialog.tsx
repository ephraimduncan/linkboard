"use client";
import { PlusIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/primitives/button";
import { Checkbox, CheckboxField } from "~/components/primitives/checkbox";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "~/components/primitives/dialog";
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
import { Textarea } from "~/components/primitives/textarea";
import { api } from "~/trpc/react";
import { revalidateFromClient } from "../../revalidate-on-client";

const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  isPublic: z.boolean(),
});

type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

type AddCollectionDialogProps = {
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
};

export const AddCollectionDialog = ({
  children,
  className,
  icon = true,
}: AddCollectionDialogProps) => {
  const { mutateAsync: addCollection, isLoading } =
    api.collection.create.useMutation();

  const form = useForm<CreateCollectionInput>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateCollectionInput) => {
    await addCollection(
      {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
      },
      {
        onSuccess: () => {
          revalidateFromClient("/collection");
          toast.success("Collection created");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to create collection");
        },
      },
    );

    form.reset();
    setIsOpen(false);
  };

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        className="whitespace-nowrap"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {icon && <PlusIcon />}
        {children || "New Collection"}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <div>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription className="-mt-[1px]">
            Organize your bookmarks into collections
          </DialogDescription>
        </div>

        <DialogBody>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="design inspo"
                        {...field}
                        name="name"
                        value={field.value || ""}
                      />
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
                      <Textarea
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
                  <FormItem className="space-y-1">
                    <FormControl>
                      <CheckboxField>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          name="isPublic"
                          className="mr-0"
                        />
                        <FormLabel>Make collection public</FormLabel>
                      </CheckboxField>
                    </FormControl>
                    <FormDescription>
                      Public collections are visible on your profile
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
            {isLoading ? "Creating..." : "Create Collection"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCollectionDialog;
