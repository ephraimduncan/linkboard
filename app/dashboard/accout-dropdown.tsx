"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucia";
import { Button } from "~/components/primitives/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "~/components/primitives/dialog";
import { DropdownItem, DropdownLabel, DropdownMenu } from "~/components/primitives/dropdown";
import { Input } from "~/components/primitives/input";
import { logout } from "~/lib/auth/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/primitives/form";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import { revalidateFromClient } from "../revalidate-on-client";
import { TRPCClientError } from "@trpc/client";
import { User as UserIcon } from "~/components/icons/user";
import { Logout } from "~/components/icons/logout";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  username: z.string().min(4, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional(),
});

export function AccountDropdownMenu({ anchor, user }: { anchor: "top start" | "bottom end"; user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: updateUser, isLoading: isUpdatingAccount } = api.user.updateProfile.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      username: user.username ?? "",
      email: user.email,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUser(values);
      toast.success("Account information updated");

      revalidateFromClient("/dashboard");
      setIsOpen(false);
    } catch (error) {
      let errorMessage = "Failed to update account information";

      if (error instanceof Error && "message" in error) {
        errorMessage = error.message;
      }

      if (error instanceof TRPCClientError) {
        if (error.data?.code === "CONFLICT") {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);

      if (error instanceof TRPCClientError && error.data?.code === "CONFLICT") {
        form.setFocus("username");
      }
    }
  };
  return (
    <>
      <DropdownMenu className="min-w-56 p-1 mx-auto" anchor={anchor}>
        <DropdownItem href="#">
          <UserIcon className="size-4 mr-2" />
          <DropdownLabel onClick={() => setIsOpen(true)}>My account</DropdownLabel>
        </DropdownItem>
        <DropdownItem onClick={async () => await logout()}>
          <Logout className="size-4 mr-2" />
          <DropdownLabel className="!lowercase">Log out</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Account Details</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="!mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} className="!mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="!mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogActions>
              <Button plain onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty || isUpdatingAccount}>
                {isUpdatingAccount && <Loader className="animate-spin size-4" />}
                Update
              </Button>
            </DialogActions>
          </form>
        </Form>
      </Dialog>
    </>
  );
}
