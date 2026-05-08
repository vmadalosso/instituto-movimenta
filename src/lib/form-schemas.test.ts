import { describe, expect, it } from "vitest";
import { contatoSchema, cursinhoSchema, doacoesSchema, voluntarioSchema } from "./form-schemas";

describe("form schemas", () => {
  it("validates contato schema with valid data", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      subject: "Parceria",
      message: "Gostaria de conversar sobre uma parceria comunitária.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects contato schema with invalid email", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria-at-example.com",
      subject: "Parceria",
      message: "Mensagem válida.",
    });

    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(["email"]);
  });

  it("validates cursinho schema with valid data", () => {
    const result = cursinhoSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      phone: "51999999999",
      city: "Porto Alegre",
    });

    expect(result.success).toBe(true);
  });

  it("validates doacoes schema with a positive amount", () => {
    const result = doacoesSchema.safeParse({ amount: 120 });

    expect(result.success).toBe(true);
  });

  it("rejects doacoes schema with zero amount", () => {
    const result = doacoesSchema.safeParse({ amount: 0 });

    expect(result.success).toBe(false);
  });

  it("validates voluntario schema with valid data", () => {
    const result = voluntarioSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      phone: "51988888888",
      interest: "Educação",
      message: "Tenho experiência em oficinas educativas.",
    });

    expect(result.success).toBe(true);
  });
});
