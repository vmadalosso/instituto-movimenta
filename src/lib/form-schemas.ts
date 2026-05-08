import { z } from "zod";

export const contatoSchema = z.object({
  name: z.string().min(2, "Digite seu nome"),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(5, "Informe um assunto"),
  message: z.string().min(10, "Escreva sua mensagem"),
});

export const cursinhoSchema = z.object({
  name: z.string().min(2, "Digite seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  city: z.string().min(2, "Informe sua cidade"),
});

export const doacoesSchema = z.object({
  amount: z.number().min(1, "Informe um valor para a doação"),
});

export const voluntarioSchema = z.object({
  name: z.string().min(2, "Digite seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  interest: z.string().min(1, "Escolha uma área de interesse"),
  message: z.string().optional(),
});

export type ContatoFormValues = z.infer<typeof contatoSchema>;
export type CursinhoFormValues = z.infer<typeof cursinhoSchema>;
export type DoacoesFormValues = z.infer<typeof doacoesSchema>;
export type VoluntarioFormValues = z.infer<typeof voluntarioSchema>;
