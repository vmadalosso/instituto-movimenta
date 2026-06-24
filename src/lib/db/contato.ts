import { createServerSupabaseClient } from "@/lib/supabase";

export type ContatoRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  lida: boolean;
  created_at: string;
};

export type ContatoInsert = Omit<ContatoRow, "id" | "created_at" | "lida">;

type ActionResult = { success: true; message: string } | { success: false; message: string };
type DbListOptions = { page?: number; pageSize?: number; dateFrom?: string; dateTo?: string };

export async function insertContato(data: ContatoInsert): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("mensagens_contato").insert(data);
  if (error) return { success: false, message: "Erro ao enviar a mensagem. Tente novamente." };
  return { success: true, message: "Mensagem enviada com sucesso!" };
}

export async function listContato(
  opts: DbListOptions = {},
): Promise<{ data: ContatoRow[]; total: number }> {
  const { page = 1, pageSize = 50, dateFrom, dateTo } = opts;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("mensagens_contato")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");
  const { data, count } = await query;
  return { data: data ?? [], total: count ?? 0 };
}

export async function countContato(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("mensagens_contato")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function countUnreadContato(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("mensagens_contato")
    .select("*", { count: "exact", head: true })
    .eq("lida", false);
  return count ?? 0;
}

export async function toggleLidaContato(id: string, lida: boolean): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("mensagens_contato").update({ lida }).eq("id", id);
  return { success: !error };
}

export async function deleteContato(id: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("mensagens_contato").delete().eq("id", id);
  return { success: !error };
}
