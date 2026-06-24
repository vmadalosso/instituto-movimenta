"use client";

import { useRef, useState } from "react";
import { CheckCircle2, HandHeart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { VoluntarioFormValues, voluntarioSchema } from "@/lib/form-schemas";
import { maskBrPhone } from "@/lib/utils";
import { submitVoluntario } from "@/lib/actions/voluntarios";

const INTERESTS = [
  "Educação",
  "Cultura",
  "Lazer",
  "Solidariedade",
  "Meio ambiente",
  "Comunicação",
  "Outro",
];

const HOW_FOUND = ["Instagram", "Amigos ou família", "Evento do Movimenta", "Outro"];

function ChipRadioGroup({
  options,
  selected,
  name,
  register,
  error,
}: {
  options: string[];
  selected: string | undefined;
  name: keyof VoluntarioFormValues;
  register: ReturnType<typeof useForm<VoluntarioFormValues>>["register"];
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === option
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-foreground/80 hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <input type="radio" value={option} {...register(name)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function VoluntarioForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

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
      city: "",
      state: "",
      instagram: "",
      interest: "",
      schoolOrUniversity: "",
      howFound: "",
      consent: false,
    },
  });

  const selectedInterest = watch("interest");
  const selectedHowFound = watch("howFound");
  const isStudent = watch("isStudent");

  const onSubmit = async (values: VoluntarioFormValues) => {
    setSubmitError(null);
    const { consent: _, ...data } = values;
    const result = await submitVoluntario(data, honeypotRef.current?.value ?? "");
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
          <h2 className="font-display text-3xl font-bold text-primary">Recebemos seu cadastro!</h2>
          <p className="mt-3 text-foreground/75">
            Em breve entraremos em contato para te conectar a uma frente de atuação.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
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

        <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-elevated space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-warm text-highlight-foreground">
              <HandHeart className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary">Quero ser voluntário</h2>
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
            <Input placeholder="Instagram (opcional, ex: @seuperfil)" {...register("instagram")} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Área de interesse</p>
            <ChipRadioGroup
              options={INTERESTS}
              selected={selectedInterest}
              name="interest"
              register={register}
              error={errors.interest?.message}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Você é estudante?</p>
            <div className="flex gap-2">
              {(["sim", "nao"] as const).map((val) => (
                <label
                  key={val}
                  className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    isStudent === val
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <input type="radio" value={val} {...register("isStudent")} className="sr-only" />
                  {val === "sim" ? "Sim" : "Não"}
                </label>
              ))}
            </div>
            {errors.isStudent && (
              <p className="text-sm text-destructive">{errors.isStudent.message}</p>
            )}
          </div>

          {isStudent === "sim" && (
            <div className="space-y-2">
              <Input placeholder="Escola ou universidade" {...register("schoolOrUniversity")} />
              {errors.schoolOrUniversity && (
                <p className="text-sm text-destructive">{errors.schoolOrUniversity.message}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Como você conheceu o Movimenta?</p>
            <ChipRadioGroup
              options={HOW_FOUND}
              selected={selectedHowFound}
              name="howFound"
              register={register}
              error={errors.howFound?.message}
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground/80">
                Concordo que meus dados sejam usados pelo Instituto Movimenta para fins de
                voluntariado.
              </span>
            </label>
            {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            Enviar cadastro
          </Button>
        </div>
      </form>
    </section>
  );
}
