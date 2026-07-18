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

const CURSINHO_WHATSAPP_NUMBER = "555193719867";
const CURSINHO_WHATSAPP_MESSAGE = "Oi! Enviei minha inscrição para o cursinho popular. 👋";
const CURSINHO_WHATSAPP_URL = `https://wa.me/${CURSINHO_WHATSAPP_NUMBER}?text=${encodeURIComponent(CURSINHO_WHATSAPP_MESSAGE)}`;

// Path oficial do logo do WhatsApp (simple-icons, licença MIT) — lucide-react não tem ícones de marca.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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
          <p className="mt-4 text-foreground/75">
            Para agilizar o contato, chame a gente no WhatsApp:
          </p>
          <Button asChild className="mt-4 justify-center gap-2">
            <a href={CURSINHO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </Button>
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
