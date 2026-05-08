"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "@/components/ui";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 max-w-md">
            <h3 className="font-display text-3xl font-bold leading-tight">
              Receba nossa <span className="text-accent">newsletter</span>
            </h3>
            <p className="mt-3 text-primary-foreground/80">
              Histórias de transformação, mutirões e oportunidades de voluntariado direto no seu
              e-mail.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-6 flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full"
              />
              <Button type="submit" className="rounded-full">
                {done ? "Inscrito ✓" : "Inscrever"}
              </Button>
            </form>
          </div>

          <div>
            <h4 className="font-display font-bold text-accent mb-4">Navegue</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/quem-somos" className="hover:text-accent">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="/projetos" className="hover:text-accent">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/cursinho" className="hover:text-accent">
                  Cursinho popular
                </Link>
              </li>
              <li>
                <Link href="/voluntario" className="hover:text-accent">
                  Voluntariado
                </Link>
              </li>
              <li>
                <Link href="/doacoes" className="hover:text-accent">
                  Doações
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-accent mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent" />
                <span>contato@institutomovimenta.org</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <span>Rio Grande do Sul, Brasil</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/inst.movimenta/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-primary-foreground/20 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Instituto Movimenta. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito com <Heart className="h-3.5 w-3.5 fill-accent text-accent" /> por Vitor Madalosso
          </p>
        </div>
      </div>
    </footer>
  );
}
