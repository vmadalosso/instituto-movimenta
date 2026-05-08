import { PageLayout, PageHero } from "@/components/PageLayout";
import VoluntarioForm from "./VoluntarioForm";

export const metadata = {
  title: "Seja voluntário — Instituto Movimenta",
  description:
    "Junte-se ao Instituto Movimenta. Doe seu tempo, suas habilidades e transforme realidades.",
};

export default function Voluntario() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Voluntariado"
        title={
          <>
            Seu tempo é <span className="text-accent">poder de transformação</span>.
          </>
        }
        subtitle="Voluntárias e voluntários são o coração do Movimenta. Existem várias formas de contribuir — todas mudam vidas, inclusive a sua."
      />

      <VoluntarioForm />
    </PageLayout>
  );
}
