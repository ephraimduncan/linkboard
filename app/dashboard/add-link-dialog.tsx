"use client";

import { z } from "zod";
import { Button } from "~/components/primitives/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "~/components/primitives/dialog";
import { Input } from "~/components/primitives/input";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Form, FormControl, FormField, FormItem } from "~/components/primitives/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import { revalidateFromClient } from "../revalidate-on-client";

const CreateBookmarkSchema = z.object({
  url: z.string().url("Invalid URL"),
  tags: z.string().optional(),
});

type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;

export const AddLinkDialog = () => {
  const { data, mutate, isLoading, error } = api.bookmark.create.useMutation({
    onSuccess: () => {
      revalidateFromClient("/dashboard");
    },
  });

  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(CreateBookmarkSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: CreateBookmarkInput) => {
    console.log({
      title: "You submitted the following values:",
      data,
    });

    mutate({
      url: data.url,
      isPublic: false,
      tags: data.tags ? data.tags.split(",") : [],
    });

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
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>add link</DialogTitle>

        <DialogBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="https://duncan.land" {...field} name="url" value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Add tags" {...field} name="tags" value={field.value || ""} />
                    </FormControl>
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
          <Button onClick={form.handleSubmit(onSubmit)}>
            {isLoading && <Loader className="animate-spin" />}
            {isLoading ? "Adding..." : "Add link"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
