import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Página não encontrada
        </p>
        <h1 className="mt-6 font-display text-5xl font-bold text-primary">404</h1>
        <p className="mt-4 text-lg text-foreground/75">
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-gradient-warm px-8 py-4 text-sm font-semibold text-highlight-foreground shadow-soft hover:shadow-elevated transition-all"
        >
          Voltar para início
        </Link>
      </section>
    </PageLayout>
  );
}
