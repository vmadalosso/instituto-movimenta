import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Music, HandHeart, Leaf } from "lucide-react";
import { PageLayout, PageHero } from "@/components/PageLayout";
import edu from "@/assets/project-education.jpg";
import sport from "@/assets/project-sport.jpg";
import culture from "@/assets/project-culture.jpg";
import solidarity from "@/assets/project-solidarity.jpg";
import environment from "@/assets/project-environment.jpg";

export const metadata = {
  title: "Projetos — Instituto Movimenta",
  description:
    "Educação, esporte, cultura e solidariedade — conheça os projetos do Instituto Movimenta.",
};

const ITEMS = [
  {
    icon: BookOpen,
    title: "Educação",
    desc: "Cursinho pré-vestibular popular, reforço escolar e oficinas de formação política e cidadã.",
    img: edu,
    link: "/cursinho",
  },
  {
    icon: Trophy,
    title: "Esporte",
    desc: "Escolinhas comunitárias, torneios e ações que usam o esporte como direito e ferramenta de inclusão.",
    img: sport,
  },
  {
    icon: Music,
    title: "Cultura e lazer",
    desc: "Saraus, festivais, oficinas de arte e ocupação cultural dos espaços públicos do território.",
    img: culture,
  },
  {
    icon: HandHeart,
    title: "Solidariedade",
    desc: "Mutirões, distribuição de alimentos, apoio em emergências e campanhas com famílias em vulnerabilidade.",
    img: solidarity,
  },
  {
    icon: Leaf,
    title: "Meio ambiente",
    desc: "Plantio de árvores, mutirões de preservação, cuidado com nascentes e ações de educação ambiental nas cidades onde atuamos.",
    img: environment,
  },
];

export default function Projetos() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Projetos"
        title={
          <>
            Onde a gente <span className="text-accent">se movimenta</span>.
          </>
        }
        subtitle="Cada projeto é construído com a comunidade, para a comunidade. Conheça nossas frentes de atuação."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {ITEMS.map((p, i) => (
          <article
            key={p.title}
            className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <img
              src={p.img.src}
              alt={p.title}
              loading="lazy"
              width={1024}
              height={1024}
              className="rounded-3xl shadow-elevated aspect-[4/3] object-cover"
            />
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-gradient-warm text-highlight-foreground mb-4">
                <p.icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-4xl font-bold text-primary leading-tight">
                {p.title}
              </h2>
              <p className="mt-4 text-lg text-foreground/75 leading-relaxed">{p.desc}</p>
              <Link
                href={p.link ?? "/voluntario"}
                className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                {p.link ? "Saiba mais" : "Quero apoiar essa frente"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PageLayout>
  );
}
