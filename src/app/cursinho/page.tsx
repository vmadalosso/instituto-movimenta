import { Users, Clock, Heart } from "lucide-react";
import { PageLayout, PageHero } from "@/components/PageLayout";
import CursinhoForm from "./CursinhoForm";

export const metadata = {
  title: "Cursinho Pré-Vestibular Popular — Instituto Movimenta",
  description:
    "Cursinho popular e gratuito do Instituto Movimenta. Educação como direito de todas e todos.",
};

const HIGHLIGHTS = [
  {
    icon: Users,
    title: "Para quem?",
    text: "Pessoas de baixa renda que sonham com a universidade pública.",
  },
  {
    icon: Clock,
    title: "Quando?",
    text: "Aulas durante a semana, à noite, e oficinas aos sábados.",
  },
  {
    icon: Heart,
    title: "Quanto custa?",
    text: "Gratuito. O cursinho é mantido por voluntários e doações.",
  },
];

export default function Cursinho() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Cursinho Popular"
        title={
          <>
            Universidade é <span className="text-accent">para todo mundo</span>.
          </>
        }
        subtitle="Cursinho pré-vestibular popular, gratuito, organizado por professoras, professores e estudantes voluntários do Movimenta."
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-3 gap-6">
        {HIGHLIGHTS.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-3xl p-7 border border-border shadow-soft"
          >
            <div className="inline-flex p-3 rounded-2xl bg-secondary text-primary mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary">{item.title}</h3>
            <p className="mt-2 text-foreground/75">{item.text}</p>
          </div>
        ))}
      </section>

      <CursinhoForm />
    </PageLayout>
  );
}
