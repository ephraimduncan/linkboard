"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Section, Container } from "~/components/blocks";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function CTA() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    //  clear the form
    form.reset();

    toast.success("you have joined the waitlist 🚀");
  }

  const onError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
    if (errors.email) {
      toast.error(errors.email.message);
    }
  };

  return (
    <Section className="sm:my-12 sm:mb-20">
      <Container className="flex flex-col items-center text-center">
        <h2 className="!my-0 text-3xl">Ready to get started? Join the waitlist now!</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="mt-8 flex h-fit items-center justify-center gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input className="md:w-64" placeholder="duncan@linkboard.dev" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">submit</Button>
          </form>
        </Form>
      </Container>
    </Section>
  );
}

export default CTA;
