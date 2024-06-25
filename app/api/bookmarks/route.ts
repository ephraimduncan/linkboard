import { generateId } from "lucia";
import { NextResponse } from "next/server";
import { lucia } from "~/lib/auth";
import { db } from "~/server/db";
import { bookmarks } from "~/server/db/schema";

export async function POST(req: Request) {
  const allowedOrigins = ["chrome-extension://mginpfmbfkmbbnohngjmnidabofmcfap"];
  const origin = req.headers.get("origin");

  if (!origin) {
    console.error("No origin header found");
    return NextResponse.json({ error: "No origin" }, { status: 403 });
  }

  if (allowedOrigins.includes(origin)) {
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", origin);
    headers.append("Access-Control-Allow-Credentials", "true");

    // Handle preflight request
    if (req.method === "OPTIONS") {
      headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
      headers.append("Access-Control-Allow-Headers", "Content-Type");
      return new NextResponse(null, { status: 204, headers });
    }

    try {
      const cookieHeader = req.headers.get("Cookie");
      const sessionId = lucia.readSessionCookie(cookieHeader ?? "");

      if (!sessionId) {
        return NextResponse.json({ error: "LINKBOARD_ERROR_NOT_AUTHENTICATED" }, { status: 401, headers });
      }

      const { session, user } = await lucia.validateSession(sessionId);

      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        headers.append("Set-Cookie", sessionCookie.serialize());
        return NextResponse.json({ error: "Invalid session" }, { status: 401, headers });
      }

      const bookmarkFromExtension = (await req.json()) as { title: string; url: string; description: string };
      const { title, url } = bookmarkFromExtension;

      const [bookmark] = await db
        .insert(bookmarks)
        .values({
          id: generateId(15),
          userId: user.id,
          title,
          url,
          description: "tobe determined",
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      console.log(bookmark);

      return NextResponse.json({ message: "Bookmark added successfully" }, { status: 200, headers });
    } catch (error) {
      return NextResponse.json({ error: "LINKBOARD_ERROR_NOT_AUTHENTICATED" }, { status: 500, headers });
    }
  } else {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
}
