import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/primitives/sonner";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "linkboard",
  description: "social bookmarking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!lowercase">
      <body className={cn(inter.className, GeistSans.variable)}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <Toaster />
    </html>
  );
}
