import { describe, expect, it } from "vitest";
import { contatoSchema, cursinhoSchema, doacoesSchema, voluntarioSchema } from "./form-schemas";

describe("form schemas", () => {
  it("validates contato schema with valid data", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      phone: "51999999999",
      subject: "Parceria",
      message: "Gostaria de conversar sobre uma parceria comunitária.",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects contato schema when consent is false", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      phone: "51999999999",
      subject: "Parceria",
      message: "Gostaria de conversar sobre uma parceria comunitária.",
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects contato schema with invalid email", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria-at-example.com",
      phone: "51999999999",
      subject: "Parceria",
      message: "Mensagem válida.",
      consent: true,
    });

    expect(result.success).toBe(false);
    expect(result.success ? null : result.error.issues[0].path).toEqual(["email"]);
  });

  it("rejects contato schema with invalid phone number", () => {
    const result = contatoSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      phone: "123",
      subject: "Parceria",
      message: "Gostaria de conversar sobre uma parceria comunitária.",
      consent: true,
    });

    expect(result.success).toBe(false);
  });

  it("validates cursinho schema with valid data", () => {
    const result = cursinhoSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      phone: "51999999999",
      city: "Porto Alegre",
      state: "Rio Grande do Sul",
      neighborhood: "Cidade Baixa",
      school: "Escola Estadual São José",
      shift: "Noite",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects cursinho schema when shift is missing", () => {
    const result = cursinhoSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      phone: "51999999999",
      city: "Porto Alegre",
      state: "Rio Grande do Sul",
      neighborhood: "Cidade Baixa",
      school: "Escola Estadual São José",
      shift: "",
      consent: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects cursinho schema with invalid phone number", () => {
    const result = cursinhoSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      phone: "123",
      city: "Porto Alegre",
      state: "Rio Grande do Sul",
      neighborhood: "Cidade Baixa",
      school: "Escola Estadual São José",
      shift: "Manhã",
      consent: true,
    });

    expect(result.success).toBe(false);
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
      name: "Ana Costa",
      email: "ana@example.com",
      phone: "51988888888",
      city: "Porto Alegre",
      state: "Rio Grande do Sul",
      interest: "Educação",
      isStudent: "sim",
      schoolOrUniversity: "UFRGS",
      howFound: "Instagram",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects voluntario schema when isStudent is invalid", () => {
    const result = voluntarioSchema.safeParse({
      name: "Ana Costa",
      email: "ana@example.com",
      phone: "51988888888",
      city: "Porto Alegre",
      state: "Rio Grande do Sul",
      interest: "Educação",
      isStudent: "talvez",
      howFound: "Instagram",
      consent: true,
    });

    expect(result.success).toBe(false);
  });
});
