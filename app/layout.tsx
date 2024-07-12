import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
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
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            async
            src="https://analytics.duncan.land/script.js"
            data-website-id="f4bda0b5-ae4d-4ff1-91a2-a74c9f03967c"
          />
        </>
      )}
    </html>
  );
}
