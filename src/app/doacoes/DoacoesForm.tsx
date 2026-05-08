"use client";

import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { DoacoesFormValues, doacoesSchema } from "@/lib/form-schemas";

const VALUES = [30, 60, 120, 250];

export default function DoacoesForm() {
  const [sent, setSent] = useState(false);
  const [custom, setCustom] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DoacoesFormValues>({
    resolver: zodResolver(doacoesSchema),
    defaultValues: {
      amount: 60,
    },
  });

  const amount = watch("amount");

  const onSubmit = async (values: DoacoesFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      setSubmitError(
        result?.message ||
          result?.errors?.formErrors?.[0] ||
          "Erro ao registrar a doação. Tente novamente.",
      );
      return;
    }

    setSent(true);
  };

  return sent ? (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-card rounded-3xl border border-border p-10 text-center shadow-elevated">
        <div className="inline-flex p-4 rounded-full bg-accent text-accent-foreground mb-4">
          <Heart className="h-8 w-8 fill-current" />
        </div>
        <h2 className="font-display text-3xl font-bold text-primary">Obrigado pela sua doação!</h2>
        <p className="mt-3 text-foreground/75">
          Sua contribuição de R${amount} fará muita diferença.
        </p>
      </div>
    </section>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elevated">
          <input type="hidden" {...register("amount", { valueAsNumber: true })} />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-warm text-highlight-foreground">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary">Quero ajudar</h2>
          </div>
          <p className="text-foreground/70 mb-6">Escolha o valor da sua contribuição mensal:</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VALUES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setValue("amount", v, { shouldValidate: true });
                  setCustom("");
                }}
                className={`px-4 py-5 rounded-2xl font-display text-2xl font-bold border-2 transition-all ${
                  amount === v && !custom
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                R${v}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Input
              type="number"
              min={1}
              value={custom}
              onChange={(event) => {
                const nextValue = event.target.value;
                setCustom(nextValue);
                setValue("amount", Number(nextValue) || 0, { shouldValidate: true });
              }}
              placeholder="Outro valor"
              className="rounded-2xl"
            />
            {errors.amount ? (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            ) : null}
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button
            type="submit"
            disabled={isSubmitting || amount <= 0}
            className="mt-6 w-full inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Doar R${amount || 0}
          </Button>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Integração com pagamento será habilitada em breve.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { v: "R$30", t: "1 cesta básica" },
            { v: "R$60", t: "kit escolar para 3 alunos" },
            { v: "R$120", t: "1 mês de cursinho popular" },
          ].map((item) => (
            <div key={item.t} className="p-5 rounded-2xl bg-secondary">
              <div className="font-display text-xl font-bold text-primary">{item.v}</div>
              <div className="text-sm text-foreground/70 mt-1">{item.t}</div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
