"use server";

import { revalidatePath } from "next/cache";

export const revalidateFromClient = async (route: string) => {
  revalidatePath(route);
};
