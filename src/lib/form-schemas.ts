import { z } from "zod";

const consent = z.boolean().refine((v) => v === true, {
  message: "Você precisa aceitar para continuar.",
});

export const contatoSchema = z.object({
  name: z.string().min(2, "Digite seu nome"),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(5, "Informe um assunto"),
  message: z.string().min(10, "Escreva sua mensagem"),
  consent,
});

export const cursinhoSchema = z.object({
  name: z.string().min(2, "Digite seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(1, "WhatsApp obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      },
      { message: "Número inválido — inclua DDD (ex: (51) 99999-9999)" },
    ),
  city: z.string().min(2, "Informe sua cidade"),
  state: z.string().min(2, "Informe seu estado"),
  neighborhood: z.string().min(2, "Informe seu bairro"),
  school: z.string().min(2, "Informe sua escola"),
  shift: z.string().min(1, "Selecione o turno"),
  consent,
});

export const doacoesSchema = z.object({
  amount: z.number().min(1, "Informe um valor para a doação"),
});

export const voluntarioSchema = z.object({
  name: z.string().min(2, "Digite seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(1, "WhatsApp obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      },
      { message: "Número inválido — inclua DDD (ex: (51) 99999-9999)" },
    ),
  city: z.string().min(2, "Informe sua cidade"),
  state: z.string().min(2, "Informe seu estado"),
  instagram: z.string().optional(),
  interest: z.string().min(1, "Escolha uma área de interesse"),
  isStudent: z.enum(["sim", "nao"], { required_error: "Selecione uma opção" }),
  schoolOrUniversity: z.string().optional(),
  howFound: z.string().min(1, "Selecione como conheceu o Movimenta"),
  consent,
});

export type ContatoFormValues = z.infer<typeof contatoSchema>;
export type CursinhoFormValues = z.infer<typeof cursinhoSchema>;
export type DoacoesFormValues = z.infer<typeof doacoesSchema>;
export type VoluntarioFormValues = z.infer<typeof voluntarioSchema>;
