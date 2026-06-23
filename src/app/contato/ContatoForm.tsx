"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/components/ui";
import { ContatoFormValues, contatoSchema } from "@/lib/form-schemas";

export default function ContatoForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContatoFormValues>({
    resolver: zodResolver(contatoSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContatoFormValues) => {
    setSubmitError(null);
    const response = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (!response.ok) {
      setSubmitError(
        result?.message ||
          result?.errors?.formErrors?.[0] ||
          "Erro ao enviar a mensagem. Tente novamente.",
      );
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-card rounded-3xl border border-border p-10 text-center shadow-elevated">
          <div className="inline-flex p-4 rounded-full bg-accent text-accent-foreground mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary">Mensagem enviada!</h2>
          <p className="mt-3 text-foreground/75">Vamos responder o quanto antes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elevated space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-warm text-highlight-foreground">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary">Mande um recado</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input placeholder="Nome completo" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Input type="email" placeholder="E-mail" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Input placeholder="Assunto" {...register("subject")} />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Textarea {...register("message")} rows={5} placeholder="Escreva sua mensagem..." />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" /> Enviar mensagem
          </Button>
        </div>
      </form>
    </section>
  );
}
