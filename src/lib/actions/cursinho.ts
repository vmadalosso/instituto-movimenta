"use server";

import { cursinhoSchema } from "@/lib/form-schemas";
import { insertCursinho } from "@/lib/db/cursinho";
import type { CursinhoInsert } from "@/lib/db/cursinho";

type ActionResult = { success: true; message: string } | { success: false; message: string };

export async function submitCursinho(
  data: Omit<CursinhoInsert, never>,
  honeypot: string,
): Promise<ActionResult> {
  if (honeypot) return { success: true, message: "" };

  const result = cursinhoSchema.omit({ consent: true }).safeParse(data);
  if (!result.success) {
    return { success: false, message: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  return insertCursinho(result.data);
}
