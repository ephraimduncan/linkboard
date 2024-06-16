"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Section, Container } from "~/components/blocks";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function CTA() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Section className="sm:mb-20">
      <Container className="flex flex-col items-center text-center">
        <h2 className="!my-0 text-3xl">Ready to get started? Join the waitlist now!</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex h-fit items-center justify-center gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input className="md:w-64" placeholder="duncan@linkboard.dev" {...field} />
                  </FormControl>
                  {/* TODO: Replace with sonner */}
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Container>
    </Section>
  );
}

export default CTA;
