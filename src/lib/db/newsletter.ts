import { createServerSupabaseClient } from "@/lib/supabase";

export type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};

type ActionResult = { success: true; message: string } | { success: false; message: string };
type DbListOptions = {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export async function insertNewsletter(data: { email: string }): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("newsletter_emails").insert(data);
  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Este e-mail já está cadastrado na nossa newsletter." };
    }
    return { success: false, message: "Erro ao processar a inscrição. Tente novamente." };
  }
  return { success: true, message: "Inscrição confirmada!" };
}

export async function listNewsletter(
  opts: DbListOptions = {},
): Promise<{ data: NewsletterRow[]; total: number }> {
  const { page = 1, pageSize = 50, dateFrom, dateTo, search } = opts;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("newsletter_emails")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");
  if (search) query = query.ilike("email", `%${search}%`);
  const { data, count } = await query;
  return { data: data ?? [], total: count ?? 0 };
}

export async function countNewsletter(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("newsletter_emails")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function deleteNewsletter(id: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("newsletter_emails").delete().eq("id", id);
  return { success: !error };
}
