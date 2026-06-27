import { PageLayout, PageHero } from "@/components/PageLayout";
import { Heart } from "lucide-react";

export const metadata = {
  title: "Doações — Instituto Movimenta",
  description: "Sua doação fortalece projetos sociais que transformam vidas no Rio Grande do Sul.",
};

export default function Doacoes() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Doações"
        title={
          <>
            Cada real <span className="text-accent">vira ação</span>.
          </>
        }
        subtitle="Sua doação sustenta o cursinho popular, mutirões de solidariedade e oficinas culturais. Transformação que acontece no território."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-card rounded-3xl border border-border p-10 shadow-elevated text-center">
          <div className="inline-flex p-4 rounded-full bg-gradient-warm text-highlight-foreground mb-6">
            <Heart className="h-8 w-8 fill-current" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary mb-3">Em breve</h2>
          <p className="text-foreground/70 max-w-md mx-auto">
            Estamos preparando nossa plataforma de doações. Em breve você poderá contribuir
            diretamente por aqui.
          </p>
          <p className="mt-6 text-sm text-foreground/50">
            Enquanto isso, entre em contato pelo{" "}
            <a
              href="/contato"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              formulário de contato
            </a>{" "}
            para saber como apoiar o movimento.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
