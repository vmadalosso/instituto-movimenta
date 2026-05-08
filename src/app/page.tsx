import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Users,
  Sparkles,
  BookOpen,
  Trophy,
  Music,
  HandHeart,
  Leaf,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import hero from "@/assets/hero-community.jpg";
import edu from "@/assets/project-education.jpg";
import sport from "@/assets/project-sport.jpg";
import culture from "@/assets/project-culture.jpg";
import solidarity from "@/assets/project-solidarity.jpg";
import environment from "@/assets/project-environment.jpg";

export const metadata = {
  title: "Instituto Movimenta — A saída é coletiva",
  description:
    "ONG que acredita no poder do povo. Atuamos em solidariedade, educação, esporte, cultura e lazer no Rio Grande do Sul.",
};

const METRICS = [
  { value: "+500", label: "pessoas impactadas", icon: Users },
  { value: "12", label: "cidades atendidas", icon: Sparkles },
  { value: "8", label: "projetos ativos", icon: Heart },
  { value: "+120", label: "voluntários", icon: HandHeart },
];

const PROJECTS = [
  {
    title: "Educação",
    desc: "Cursinho popular e reforço escolar para quem não pode pagar.",
    img: edu,
    icon: BookOpen,
    accent: "bg-sky text-sky-foreground",
  },
  {
    title: "Esporte",
    desc: "Esporte como ferramenta de cidadania para crianças e jovens.",
    img: sport,
    icon: Trophy,
    accent: "bg-highlight text-highlight-foreground",
  },
  {
    title: "Cultura",
    desc: "Lazer, arte e cultura popular ocupando os espaços do povo.",
    img: culture,
    icon: Music,
    accent: "bg-accent text-accent-foreground",
  },
  {
    title: "Solidariedade",
    desc: "Ações emergenciais e contínuas com famílias em vulnerabilidade.",
    img: solidarity,
    icon: HandHeart,
    accent: "bg-primary text-primary-foreground",
  },
  {
    title: "Meio ambiente",
    desc: "Plantio, preservação de árvores e cuidado com o território onde a gente vive.",
    img: environment,
    icon: Leaf,
    accent: "bg-secondary text-primary",
  },
];

export default function HomePage() {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground -mt-[var(--header-h,0)]">
        <div className="absolute inset-0">
          <img
            src={hero.src}
            alt="Comunidade reunida em solidariedade"
            className="h-full w-full object-cover opacity-30"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/90" />
        </div>
        <div className="absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent/30 blur-3xl animate-float-slow" />
        <div
          className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-highlight/25 blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/95 text-accent-foreground text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Movimento social do RS
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02]">
              A saída é{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">coletiva</span>
                <span className="absolute inset-x-0 bottom-2 h-3 bg-highlight/60 -z-0 -rotate-1" />
              </span>
              .
            </h1>
            <p className="mt-7 text-lg lg:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
              O Instituto Movimenta nasce do encontro de pessoas que acreditam no poder do povo e na
              construção de um mundo mais justo, democrático e plural.
            </p>
            <p className="mt-4 text-base lg:text-lg text-primary-foreground/80 max-w-2xl">
              Viver com dignidade não pode ser privilégio de poucos. Por isso, atuamos em ações de
              solidariedade, educação, esporte, cultura e lazer.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/voluntario"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-warm text-highlight-foreground font-semibold shadow-elevated hover:scale-[1.02] transition-transform"
              >
                Seja voluntário
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/doacoes"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                <Heart className="h-4 w-4 fill-current" /> Doe agora
              </Link>
              <Link
                href="/projetos"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-colors font-semibold"
              >
                Conheça os projetos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 lg:-mt-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl bg-card rounded-3xl shadow-elevated border border-border p-6 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col items-center text-center">
                <div className="p-3 rounded-2xl bg-secondary mb-3">
                  <m.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="font-display text-3xl lg:text-4xl font-extrabold text-primary leading-none">
                  {m.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider">
          Nossa crença
        </span>
        <p className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-foreground">
          "Se tu também acredita que a saída é coletiva,{" "}
          <span className="text-highlight">vem com a gente</span> transformar a realidade."
        </p>
        <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-px w-10 bg-border" />
          Instituto Movimenta
          <span className="h-px w-10 bg-border" />
        </div>
      </section>

      <section className="bg-gradient-soft py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider">
                Nossos projetos
              </span>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">
                Quatro frentes, um <em className="not-italic text-highlight">só movimento</em>.
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PROJECTS.map((p) => (
              <article
                key={p.title}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img.src}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                  <div className={`inline-flex w-fit p-2.5 rounded-xl ${p.accent} mb-3`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-primary-foreground/85 line-clamp-2">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero text-primary-foreground p-10 lg:p-16">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-highlight/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Sua hora chegou.
                <br />
                <span className="text-accent">Vem ser parte.</span>
              </h2>
              <p className="mt-5 text-lg text-primary-foreground/85 max-w-xl">
                Doando seu tempo, seu trabalho ou seu apoio financeiro — toda contribuição
                multiplica a transformação no território.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/voluntario"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                Quero ser voluntário <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/doacoes"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-colors"
              >
                <Heart className="h-4 w-4 fill-current" /> Quero doar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
