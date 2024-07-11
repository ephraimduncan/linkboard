import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "~/components/primitives/sonner";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "linkboard",
  description: "social bookmarking",
  metadataBase: new URL("https://linkboard.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!lowercase">
      <body className={cn(inter.className, GeistSans.variable)}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
      <Toaster />
    </html>
  );
}
