"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Erro inesperado
        </p>
        <h1 className="mt-6 font-display text-5xl font-bold text-primary">Algo deu errado</h1>
        <p className="mt-4 text-lg text-foreground/75">
          Estamos trabalhando para resolver. Tente novamente em alguns instantes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-all"
          >
            Recarregar
          </button>
          <Link
            href="/"
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-all"
          >
            Ir para início
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
