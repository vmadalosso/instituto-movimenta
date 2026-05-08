"use client";

import { useState } from "react";
import { CheckCircle2, HandHeart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/components/ui";
import { VoluntarioFormValues, voluntarioSchema } from "@/lib/form-schemas";

const INTERESTS = ["Educação", "Esporte", "Cultura", "Solidariedade", "Comunicação", "Outro"];

export default function VoluntarioForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VoluntarioFormValues>({
    resolver: zodResolver(voluntarioSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
  });

  const selectedInterest = watch("interest");

  const onSubmit = async (values: VoluntarioFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/voluntario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      setSubmitError(
        result?.message ||
          result?.errors?.formErrors?.[0] ||
          "Erro ao enviar seu cadastro. Tente novamente.",
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
      <h2 className="font-display text-3xl font-bold text-primary">Recebemos seu cadastro!</h2>
      <p className="mt-3 text-foreground/75">
        Em breve entraremos em contato para te conectar a uma frente de atuação.
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
          <HandHeart className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary">Quero ser voluntário</h2>
      </div>

      <div className="space-y-2">
        <Input id="name" {...register("name")} type="text" placeholder="Nome completo" />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Input id="email" {...register("email")} type="email" placeholder="E-mail" />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Input id="phone" {...register("phone")} type="tel" placeholder="Telefone (WhatsApp)" />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Área de interesse
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const isActive = selectedInterest === interest;
            return (
              <label
                key={interest}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <input
                  type="radio"
                  value={interest}
                  {...register("interest")}
                  className="sr-only"
                />
                {interest}
              </label>
            );
          })}
        </div>
        {errors.interest ? (
          <p className="text-sm text-destructive">{errors.interest.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Conta um pouco sobre você
        </label>
        <Textarea
          {...register("message")}
          rows={4}
          placeholder="Disponibilidade, habilidades, motivações..."
        />
      </div>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
        Enviar cadastro
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Os dados serão usados apenas para contato sobre voluntariado no Instituto Movimenta.
      </p>
    </form>
  );
}
