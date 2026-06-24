"use server";

import { revalidatePath } from "next/cache";
import { deleteCursinho } from "@/lib/db/cursinho";
import { deleteVoluntario } from "@/lib/db/voluntarios";
import { deleteContato, toggleLidaContato } from "@/lib/db/contato";
import { deleteNewsletter } from "@/lib/db/newsletter";

type Table = "cursinho_inscricoes" | "voluntarios" | "mensagens_contato" | "newsletter_emails";

const DELETE_FN: Record<Table, (id: string) => Promise<{ success: boolean }>> = {
  cursinho_inscricoes: deleteCursinho,
  voluntarios: deleteVoluntario,
  mensagens_contato: deleteContato,
  newsletter_emails: deleteNewsletter,
};

const REVALIDATE_PATH: Record<Table, string> = {
  cursinho_inscricoes: "/admin/cursinho",
  voluntarios: "/admin/voluntarios",
  mensagens_contato: "/admin/contato",
  newsletter_emails: "/admin/newsletter",
};

export async function deleteRecord(table: Table, id: string): Promise<{ success: boolean }> {
  const fn = DELETE_FN[table];
  const result = await fn(id);
  if (result.success) revalidatePath(REVALIDATE_PATH[table]);
  return result;
}

export async function toggleLida(id: string, lida: boolean): Promise<{ success: boolean }> {
  const result = await toggleLidaContato(id, lida);
  if (result.success) revalidatePath("/admin/contato");
  return result;
}
