import type { Metadata } from "next";
import type React from "react";
import { ApplicationLayout } from "./application-layout";

export const metadata: Metadata = {
  title: {
    template: "%s - linkboard",
    default: "linkboard",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>;
}
