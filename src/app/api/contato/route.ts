import { NextResponse } from "next/server";
import { contatoSchema } from "@/lib/form-schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = contatoSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parseResult.error.flatten(),
      },
      { status: 422 },
    );
  }

  console.log("[API] Contato recebido:", parseResult.data);

  return NextResponse.json(
    {
      success: true,
      message: "Mensagem recebida com sucesso. Entraremos em contato em breve.",
    },
    { status: 201 },
  );
}
