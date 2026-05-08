import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-highlight/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {eyebrow && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg lg:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
