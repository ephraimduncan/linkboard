import { generateId } from "lucia";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lucia } from "~/lib/auth";
import { db } from "~/server/db";
import { bookmarks } from "~/server/db/schema";

function isValidChromeExtension(origin: string | null): boolean {
  return origin !== null && origin.startsWith("chrome-extension://");
}

const bookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().max(255),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  favicon: z.string().url().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (!origin || !isValidChromeExtension(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const headers = new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
  });

  if (req.method === "OPTIONS") {
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Allow-Credentials", "true");
    return new NextResponse(null, { status: 204, headers });
  }

  try {
    const sessionId = lucia.readSessionCookie(req.headers.get("Cookie") ?? "");
    if (!sessionId) {
      return NextResponse.json(
        { error: "LINKBOARD_ERROR_NOT_AUTHENTICATED" },
        { status: 401, headers },
      );
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      headers.set("Set-Cookie", sessionCookie.serialize());
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401, headers },
      );
    }

    const bookmarkData = await req.json();

    console.log("Bookmark data:", bookmarkData);

    const validatedData = bookmarkSchema.parse(bookmarkData);

    const [bookmark] = await db
      .insert(bookmarks)
      .values({
        id: generateId(15),
        userId: user.id,
        ...validatedData,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "Bookmark added successfully", id: bookmark.id },
      { status: 200, headers },
    );
  } catch (error) {
    console.error("Error adding bookmark:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid bookmark data", details: error.errors },
        { status: 400, headers },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers },
    );
  }
}
