import { createServerSupabaseClient } from "@/lib/supabase";

export type VoluntarioRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  instagram: string | null;
  interest: string;
  is_student: string;
  school_or_university: string | null;
  how_found: string;
  created_at: string;
};

export type VoluntarioInsert = Omit<VoluntarioRow, "id" | "created_at">;

type ActionResult = { success: true; message: string } | { success: false; message: string };
type DbListOptions = {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  interest?: string;
};

export async function insertVoluntario(data: VoluntarioInsert): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("voluntarios").insert(data);
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
  return { success: true, message: "Cadastro recebido com sucesso!" };
}

export async function listVoluntarios(
  opts: DbListOptions = {},
): Promise<{ data: VoluntarioRow[]; total: number }> {
  const { page = 1, pageSize = 50, dateFrom, dateTo, city, interest } = opts;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("voluntarios")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");
  if (city) query = query.ilike("city", `%${city}%`);
  if (interest) query = query.ilike("interest", `%${interest}%`);
  const { data, count } = await query;
  return { data: data ?? [], total: count ?? 0 };
}

export async function countVoluntarios(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase.from("voluntarios").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function deleteVoluntario(id: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("voluntarios").delete().eq("id", id);
  return { success: !error };
}
