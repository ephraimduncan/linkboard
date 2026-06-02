import { createHash } from "node:crypto";

export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
