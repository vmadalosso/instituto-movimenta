import { NextResponse } from "next/server";
import { doacoesSchema } from "@/lib/form-schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = doacoesSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parseResult.error.flatten(),
      },
      { status: 422 },
    );
  }

  console.log("[API] Doação recebida:", parseResult.data);

  return NextResponse.json(
    {
      success: true,
      message: "Doação registrada com sucesso. Obrigado por apoiar o movimento.",
    },
    { status: 201 },
  );
}
