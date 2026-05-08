import { NextResponse } from "next/server";
import { cursinhoSchema } from "@/lib/form-schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = cursinhoSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parseResult.error.flatten(),
      },
      { status: 422 },
    );
  }

  console.log("[API] Inscrição cursinho recebida:", parseResult.data);

  return NextResponse.json(
    {
      success: true,
      message: "Inscrição enviada com sucesso. Avisaremos por e-mail sobre os próximos passos.",
    },
    { status: 201 },
  );
}
