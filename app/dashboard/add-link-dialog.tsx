"use client";

import { z } from "zod";
import { Button } from "~/components/primitives/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "~/components/primitives/dialog";
import { Input } from "~/components/primitives/input";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/primitives/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import { revalidateFromClient } from "../revalidate-on-client";
import { MultiInput } from "~/components/primitives/multi-input";
import { toast } from "sonner";

const CreateBookmarkSchema = z.object({
  url: z.string().url("Invalid URL"),
  tags: z.array(z.string().trim()),
});

type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;

export const AddLinkDialog = () => {
  const { mutateAsync: addBookmark, isLoading } = api.bookmark.create.useMutation();

  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(CreateBookmarkSchema),
    defaultValues: {
      url: "",
      tags: [],
    },
  });

  const onSubmit = async (data: CreateBookmarkInput) => {
    await addBookmark(
      {
        url: data.url,
        isPublic: false,
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
      }
    );

    form.reset();
    setIsOpen(false);
  };

  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add link
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} className="space-y-4">
        <DialogTitle>add link</DialogTitle>

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
                      <Input placeholder="https://duncan.land" {...field} name="url" value={field.value || ""} />
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
                      <MultiInput {...field} />
                    </FormControl>
                    <FormDescription>Enter tags related to your bookmark</FormDescription>
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
            {isLoading ? "Adding..." : "Add link"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
