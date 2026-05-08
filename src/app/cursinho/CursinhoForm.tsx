"use client";

import { useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { CursinhoFormValues, cursinhoSchema } from "@/lib/form-schemas";

const fields: Array<{ label: string; name: keyof CursinhoFormValues; type: string }> = [
  { label: "Nome completo", name: "name", type: "text" },
  { label: "E-mail", name: "email", type: "email" },
  { label: "Telefone", name: "phone", type: "tel" },
  { label: "Cidade", name: "city", type: "text" },
];

export default function CursinhoForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CursinhoFormValues>({
    resolver: zodResolver(cursinhoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
    },
  });

  const onSubmit = async (values: CursinhoFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/cursinho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      setSubmitError(
        result?.message ||
          result?.errors?.formErrors?.[0] ||
          "Erro ao enviar a inscrição. Tente novamente.",
      );
      return;
    }

    setSent(true);
  };

  return sent ? (
    <div className="bg-card rounded-3xl border border-border p-10 text-center shadow-elevated">
      <div className="inline-flex p-4 rounded-full bg-accent text-accent-foreground mb-4">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="font-display text-3xl font-bold text-primary">Inscrição recebida!</h2>
      <p className="mt-3 text-foreground/75">
        Em breve enviaremos as próximas etapas para o seu e-mail.
      </p>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-soft space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-warm text-highlight-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary">Quero me inscrever</h2>
      </div>

      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.label}
            {...register(field.name)}
          />
          {errors[field.name] ? (
            <p className="text-sm text-destructive">{errors[field.name]?.message}</p>
          ) : null}
        </div>
      ))}

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
        Enviar inscrição
      </Button>
    </form>
  );
}
