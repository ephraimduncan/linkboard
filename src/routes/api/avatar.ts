import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getSession } from "@/lib/auth-server";
import { createDb } from "@/lib/db";
import { user } from "@/lib/db/schema";

const ACCEPTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const AVATAR_URL_PREFIX = "/avatars/";

function avatarKeyFromUrl(value: string | null | undefined): string | null {
  if (!value || !value.startsWith(AVATAR_URL_PREFIX)) return null;
  const key = value.slice(AVATAR_URL_PREFIX.length);
  if (!key || key.includes("..") || key.includes("/")) return null;
  return key;
}

async function handlePost(request: Request): Promise<Response> {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ message: "File is required" }, { status: 400 });
    }
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      return Response.json(
        { message: "Only PNG, JPEG, WebP, and GIF are allowed" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { message: "File size must be 2MB or less" },
        { status: 400 },
      );
    }

    const db = createDb();
    const [currentUser] = await db
      .select({ image: user.image })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    const key = `${session.user.id}-${crypto.randomUUID()}.webp`;
    await env.AVATARS.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    const uploadedUrl = `${AVATAR_URL_PREFIX}${key}`;

    try {
      await db
        .update(user)
        .set({ image: uploadedUrl })
        .where(eq(user.id, session.user.id));
    } catch (error) {
      try {
        await env.AVATARS.delete(key);
      } catch (cleanupError) {
        console.error("[avatar/post] failed to cleanup upload", cleanupError);
      }
      throw error;
    }

    const previousKey = avatarKeyFromUrl(currentUser?.image);
    if (previousKey && previousKey !== key) {
      try {
        await env.AVATARS.delete(previousKey);
      } catch (error) {
        console.error("[avatar/post] failed to delete previous image", error);
      }
    }

    return Response.json({ url: uploadedUrl });
  } catch (error) {
    console.error("[avatar/post] upload failed", error);
    return Response.json(
      { message: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}

async function handleDelete(): Promise<Response> {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = createDb();
    const [currentUser] = await db
      .select({ image: user.image })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    await db
      .update(user)
      .set({ image: null })
      .where(eq(user.id, session.user.id));

    const key = avatarKeyFromUrl(currentUser?.image);
    if (key) {
      try {
        await env.AVATARS.delete(key);
      } catch (error) {
        console.error("[avatar/delete] failed to delete object", error);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[avatar/delete] failed", error);
    return Response.json(
      { message: "Failed to remove avatar" },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/avatar")({
  server: {
    handlers: {
      POST: ({ request }) => handlePost(request),
      DELETE: () => handleDelete(),
    },
  },
});
