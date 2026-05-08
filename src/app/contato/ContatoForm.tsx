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

  return sent ? (
    <div className="bg-card rounded-3xl border border-border p-10 text-center shadow-elevated flex flex-col items-center justify-center">
      <div className="inline-flex p-4 rounded-full bg-accent text-accent-foreground mb-4">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="font-display text-3xl font-bold text-primary">Mensagem enviada!</h2>
      <p className="mt-3 text-foreground/75">Vamos responder o quanto antes.</p>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-soft space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input id="name" {...register("name")} placeholder="Nome" />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Input id="email" type="email" {...register("email")} placeholder="E-mail" />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Input id="subject" {...register("subject")} placeholder="Assunto" />
        {errors.subject ? (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
          Mensagem
        </label>
        <Textarea
          id="message"
          {...register("message")}
          rows={5}
          placeholder="Escreva sua mensagem"
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-warm text-highlight-foreground font-semibold shadow-soft hover:shadow-elevated transition-all"
      >
        <Send className="h-4 w-4" /> Enviar mensagem
      </Button>
    </form>
  );
}
