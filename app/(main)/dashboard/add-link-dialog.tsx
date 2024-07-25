"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";
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
import { MultiInput } from "~/components/primitives/multi-input";
import { api } from "~/trpc/react";
import { revalidateFromClient } from "../../revalidate-on-client";

const CreateBookmarkSchema = z.object({
  url: z.string().url("Invalid URL"),
  tags: z.array(z.string().trim()),
  isPublic: z.boolean(),
});

type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;

type AddLinkDialogProps = {
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
};

export const AddLinkDialog = ({
  children,
  className,
  icon = true,
}: AddLinkDialogProps) => {
  const { mutateAsync: addBookmark, isLoading } =
    api.bookmark.create.useMutation();

  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(CreateBookmarkSchema),
    defaultValues: {
      url: "",
      tags: [],
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateBookmarkInput) => {
    await addBookmark(
      {
        url: data.url,
        isPublic: data.isPublic || false,
        tags: data.tags,
      },
      {
        onSuccess: () => {
          revalidateFromClient("/dashboard");

          toast.success("Bookmark added");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to add bookmark");
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
        {icon && <PlusIcon className="size-4" />}
        {children || "add bookmark"}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <div>
          <DialogTitle>add bookmark</DialogTitle>
          <DialogDescription className="mt-0">
            new bookmarks are private on default
          </DialogDescription>
        </div>

        <DialogBody>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://duncan.land"
                        {...field}
                        name="url"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiInput
                        {...field}
                        onBlur={(currentInputValue) => {
                          if (currentInputValue.trim()) {
                            field.onChange([
                              ...field.value,
                              currentInputValue.trim(),
                            ]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter tags related to your bookmark
                    </FormDescription>
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
                        <FormLabel>Make bookmark public</FormLabel>
                      </CheckboxField>
                    </FormControl>
                    <FormDescription>
                      Public bookmarks are visible to others
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
            {isLoading ? "Adding..." : "Add Bookmark"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
