"use server";

import { voluntarioSchema } from "@/lib/form-schemas";
import { insertVoluntario } from "@/lib/db/voluntarios";

type ActionResult = { success: true; message: string } | { success: false; message: string };

export async function submitVoluntario(
  data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    instagram?: string;
    interest: string;
    isStudent: "sim" | "nao";
    schoolOrUniversity?: string;
    howFound: string;
  },
  honeypot: string,
): Promise<ActionResult> {
  if (honeypot) return { success: true, message: "" };

  const result = voluntarioSchema.omit({ consent: true }).safeParse(data);
  if (!result.success) {
    return { success: false, message: "Dados inválidos. Verifique os campos e tente novamente." };
  }

  const { isStudent, schoolOrUniversity, howFound, ...rest } = result.data;
  return insertVoluntario({
    ...rest,
    instagram: rest.instagram ?? null,
    is_student: isStudent,
    school_or_university: schoolOrUniversity ?? null,
    how_found: howFound,
  });
}
