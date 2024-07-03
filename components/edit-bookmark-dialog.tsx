"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/primitives/form";
import { Input } from "~/components/primitives/input";
import { MultiInput } from "~/components/primitives/multi-input";
import {
  UpdateBookmarkInput,
  UpdateBookmarkSchema,
} from "~/server/api/routers/bookmark/bookmark.input";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { Checkbox, CheckboxField } from "./primitives/checkbox";
import { Label } from "./primitives/fieldset";

type EditBookmarkDialogProps = {
  bookmark: BookmarkWithTags;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const EditBookmarkDialog = ({
  bookmark,
  isOpen,
  setIsOpen,
}: EditBookmarkDialogProps) => {
  const { mutateAsync: updateBookmark, isLoading } =
    api.bookmark.update.useMutation();

  const form = useForm<UpdateBookmarkInput>({
    resolver: zodResolver(UpdateBookmarkSchema),
    defaultValues: {
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description ?? "",
      isPublic: bookmark.isPublic,
      tags: bookmark.tags.map((t) => t.tag.name),
    },
  });

  const onSubmit = async (data: UpdateBookmarkInput) => {
    await updateBookmark(data, {
      onSuccess: () => {
        revalidateFromClient("/dashboard");
        toast.success("Bookmark updated");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Failed to update bookmark");
      },
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Edit Bookmark</DialogTitle>

      <DialogBody>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} name="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} name="title" />
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
                      <Label>Make bookmark public</Label>
                    </CheckboxField>
                  </FormControl>
                  <FormDescription>
                    Public bookmarks are visible to others
                  </FormDescription>
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
                    <MultiInput {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter tags related to your bookmark
                  </FormDescription>
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
        <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
          {isLoading && <Loader className="animate-spin size-4" />}
          {isLoading ? "Updating..." : "Update bookmark"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
