"use server";

import { z } from "zod";
import { insertNewsletter } from "@/lib/db/newsletter";

type ActionResult = { success: true; message: string } | { success: false; message: string };

const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function submitNewsletter(
  data: { email: string },
  honeypot: string,
): Promise<ActionResult> {
  if (honeypot) return { success: true, message: "" };

  const result = newsletterSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "E-mail inválido." };
  }

  return insertNewsletter(result.data);
}
