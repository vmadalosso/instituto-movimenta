"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import logo from "@/assets/logo-movimenta.jpg";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/quem-somos", label: "Quem somos" },
  { to: "/projetos", label: "Projetos" },
  { to: "/cursinho", label: "Cursinho" },
  { to: "/cidades", label: "Cidades" },
  { to: "/contato", label: "Contato" },
] as const;

function navClass(to: string, current: string | null) {
  const isActive = current === to;
  return `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? "text-primary bg-secondary"
      : "text-foreground/80 hover:text-primary hover:bg-secondary"
  }`;
}

function mobileLinkClass(to: string, current: string | null) {
  const isActive = current === to;
  return `px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
    isActive ? "text-primary bg-secondary" : "text-foreground/80 hover:bg-secondary"
  }`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={logo.src}
              alt="Instituto Movimenta"
              className="h-11 w-11 rounded-xl object-cover shadow-soft"
              width={44}
              height={44}
            />
            <span className="font-display text-lg font-bold leading-none text-primary">
              Instituto
              <br />
              <span className="text-highlight">Movimenta</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.to} href={item.to} className={navClass(item.to, pathname)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full text-sm font-semibold px-4 py-2"
            >
              <Link href="/voluntario">Seja voluntário</Link>
            </Button>
            <Button asChild className="rounded-full text-sm font-semibold px-5 py-2">
              <Link href="/doacoes">Doe agora</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            className="lg:hidden p-2 rounded-lg text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-up">
            <nav className="flex flex-col gap-1 bg-card rounded-2xl p-3 shadow-elevated border border-border">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass(item.to, pathname)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-border">
                <Link
                  href="/voluntario"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-center text-primary border border-primary/30"
                >
                  Voluntário
                </Link>
                <Link
                  href="/doacoes"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-center bg-gradient-warm text-highlight-foreground"
                >
                  Doar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
