"use client";

import { useRef, useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { CursinhoFormValues, cursinhoSchema } from "@/lib/form-schemas";
import { maskBrPhone } from "@/lib/utils";
import { submitCursinho } from "@/lib/actions/cursinho";

const SHIFTS = ["Manhã", "Tarde", "Noite"];

export default function CursinhoForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CursinhoFormValues>({
    resolver: zodResolver(cursinhoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      neighborhood: "",
      school: "",
      shift: "",
      consent: false,
    },
  });

  const selectedShift = watch("shift");

  const onSubmit = async (values: CursinhoFormValues) => {
    setSubmitError(null);
    const { consent: _, ...data } = values;
    const result = await submitCursinho(data, honeypotRef.current?.value ?? "");
    if (!result.success) {
      setSubmitError(result.message);
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
          <h2 className="font-display text-3xl font-bold text-primary">Inscrição recebida!</h2>
          <p className="mt-3 text-foreground/75">
            Em breve enviaremos as próximas etapas para o seu e-mail.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* honeypot — oculto via CSS, não registrado no RHF */}
        <input
          ref={honeypotRef}
          name="website"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          style={{ display: "none" }}
        />

        <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elevated space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-warm text-highlight-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary">Quero me inscrever</h2>
          </div>

          <div className="space-y-2">
            <Input placeholder="Nome completo" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Input type="email" placeholder="E-mail" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            {(() => {
              const { onChange, ...field } = register("phone");
              return (
                <Input
                  {...field}
                  type="tel"
                  placeholder="Telefone/WhatsApp — (51) 99999-9999"
                  onChange={(e) => {
                    e.target.value = maskBrPhone(e.target.value);
                    onChange(e);
                  }}
                />
              );
            })()}
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input placeholder="Cidade" {...register("city")} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Input placeholder="Estado" {...register("state")} />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Input placeholder="Bairro" {...register("neighborhood")} />
            {errors.neighborhood && (
              <p className="text-sm text-destructive">{errors.neighborhood.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input placeholder="Escola" {...register("school")} />
            {errors.school && <p className="text-sm text-destructive">{errors.school.message}</p>}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Turno que estuda</p>
            <div className="flex flex-wrap gap-2">
              {SHIFTS.map((shift) => (
                <label
                  key={shift}
                  className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    selectedShift === shift
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <input type="radio" value={shift} {...register("shift")} className="sr-only" />
                  {shift}
                </label>
              ))}
            </div>
            {errors.shift && <p className="text-sm text-destructive">{errors.shift.message}</p>}
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground/80">
                Concordo que meus dados sejam usados pelo Instituto Movimenta para fins de inscrição
                no cursinho popular.
              </span>
            </label>
            {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            Enviar inscrição
          </Button>
        </div>
      </form>
    </section>
  );
}
