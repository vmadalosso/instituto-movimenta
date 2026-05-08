import { NextResponse } from "next/server";
import { voluntarioSchema } from "@/lib/form-schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = voluntarioSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parseResult.error.flatten(),
      },
      { status: 422 },
    );
  }

  console.log("[API] Voluntariado recebido:", parseResult.data);

  return NextResponse.json(
    {
      success: true,
      message: "Cadastro de voluntariado enviado com sucesso. Vamos te contatar em breve.",
    },
    { status: 201 },
  );
}
