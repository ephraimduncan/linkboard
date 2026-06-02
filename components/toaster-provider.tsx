import { ClientOnly } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export function ToasterProvider() {
  return (
    <ClientOnly>
      <Toaster />
    </ClientOnly>
  );
}
