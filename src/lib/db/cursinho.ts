import { createServerSupabaseClient } from "@/lib/supabase";

export type CursinhoRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  neighborhood: string;
  school: string;
  shift: string;
  created_at: string;
};

export type CursinhoInsert = Omit<CursinhoRow, "id" | "created_at">;

export type ActionResult = { success: true; message: string } | { success: false; message: string };

export type DbListOptions = {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
};

export async function insertCursinho(data: CursinhoInsert): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("cursinho_inscricoes").insert(data);
  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message:
          "Este e-mail já está cadastrado. Entre em contato se precisar atualizar seus dados.",
      };
    }
    return { success: false, message: "Erro ao salvar os dados. Tente novamente." };
  }
  return { success: true, message: "Inscrição recebida com sucesso!" };
}

export async function listCursinho(
  opts: DbListOptions = {},
): Promise<{ data: CursinhoRow[]; total: number }> {
  const { page = 1, pageSize = 50, dateFrom, dateTo, city } = opts;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("cursinho_inscricoes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");
  if (city) query = query.ilike("city", `%${city}%`);
  const { data, count } = await query;
  return { data: data ?? [], total: count ?? 0 };
}

export async function countCursinho(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("cursinho_inscricoes")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function deleteCursinho(id: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("cursinho_inscricoes").delete().eq("id", id);
  return { success: !error };
}
