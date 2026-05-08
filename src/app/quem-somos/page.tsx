import { Eye, Target, Sparkles } from "lucide-react";
import { PageLayout, PageHero } from "@/components/PageLayout";
import hero from "@/assets/hero-community.jpg";

export const metadata = {
  title: "Quem somos — Instituto Movimenta",
  description: "Conheça a história, missão, visão e valores do Instituto Movimenta.",
};

const PILLARS = [
  {
    icon: Target,
    title: "Missão",
    text: "Promover dignidade, direitos e oportunidades através de ações coletivas em educação, esporte, cultura e solidariedade.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser referência em organização popular no Rio Grande do Sul, fortalecendo comunidades e sujeitos políticos.",
  },
  {
    icon: Sparkles,
    title: "Valores",
    text: "Solidariedade, democracia, pluralidade, justiça social e o protagonismo das comunidades onde atuamos.",
  },
];

export default function QuemSomos() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Quem somos"
        title={
          <>
            Pessoas que acreditam no <span className="text-accent">poder do povo</span>.
          </>
        }
        subtitle="Somos um instituto que se organiza para transformar realidades — uma ação, um encontro, uma vida por vez."
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <img
            src={hero.src}
            alt="Instituto reunido"
            loading="lazy"
            width={1920}
            height={1080}
            className="rounded-3xl shadow-elevated aspect-[4/3] object-cover"
          />
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider">
              Nossa história
            </span>
            <h2 className="mt-4 font-display text-3xl lg:text-4xl font-bold text-primary leading-tight">
              Do encontro nasceu o movimento.
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed">
              O Instituto Movimenta nasceu da inquietação de pessoas que viram, no cotidiano, que a
              transformação real só acontece quando construída coletivamente. Começamos pequenos,
              com mutirões e oficinas, e hoje articulamos projetos contínuos em várias cidades do
              Rio Grande do Sul.
            </p>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              Cada ação carrega a certeza de que dignidade não é privilégio — é direito.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="bg-card rounded-3xl p-8 shadow-soft border border-border hover:shadow-elevated transition-shadow"
              >
                <div className="inline-flex p-3 rounded-2xl bg-gradient-warm text-highlight-foreground mb-5">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">{p.title}</h3>
                <p className="mt-3 text-foreground/75 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
