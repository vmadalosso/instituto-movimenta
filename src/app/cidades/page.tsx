import { MapPin } from "lucide-react";
import { PageLayout, PageHero } from "@/components/PageLayout";

export const metadata = {
  title: "Cidades atendidas — Instituto Movimenta",
  description: "Conheça as cidades do Rio Grande do Sul onde o Instituto Movimenta atua.",
};

const CIDADES = [
  "Porto Alegre",
  "Canoas",
  "Viamão",
  "Alvorada",
  "Gravataí",
  "Cachoeirinha",
  "Sapucaia do Sul",
  "São Leopoldo",
  "Novo Hamburgo",
  "Pelotas",
  "Caxias do Sul",
  "Santa Maria",
];

export default function Cidades() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Territórios"
        title={
          <>
            Onde o Movimenta <span className="text-accent">está</span>.
          </>
        }
        subtitle="Atuamos em diversas cidades do Rio Grande do Sul, sempre em parceria com lideranças e coletivos locais."
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CIDADES.map((cidade) => (
            <div
              key={cidade}
              className="group flex items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all"
            >
              <div className="p-2 rounded-lg bg-secondary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <MapPin className="h-4 w-4 text-primary group-hover:text-accent-foreground" />
              </div>
              <span className="font-medium text-foreground">{cidade}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-muted-foreground">
          Quer levar o Movimenta para sua cidade?{" "}
          <a href="/contato" className="text-primary font-semibold underline">
            Fale com a gente
          </a>
          .
        </p>
      </section>
    </PageLayout>
  );
}
