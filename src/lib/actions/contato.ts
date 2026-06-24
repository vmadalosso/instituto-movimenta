"use server";

import { contatoSchema } from "@/lib/form-schemas";
import { insertContato } from "@/lib/db/contato";

type ActionResult = { success: true; message: string } | { success: false; message: string };

export async function submitContato(
  data: { name: string; email: string; subject: string; message: string },
  honeypot: string,
): Promise<ActionResult> {
  if (honeypot) return { success: true, message: "" };

  const result = contatoSchema.omit({ consent: true }).safeParse(data);
  if (!result.success) {
    return { success: false, message: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  return insertContato(result.data);
}
