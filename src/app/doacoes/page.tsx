import { PageLayout, PageHero } from "@/components/PageLayout";
import DoacoesForm from "./DoacoesForm";

export const metadata = {
  title: "Doações — Instituto Movimenta",
  description: "Sua doação fortalece projetos sociais que transformam vidas no Rio Grande do Sul.",
};

export default function Doacoes() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Doações"
        title={
          <>
            Cada real <span className="text-accent">vira ação</span>.
          </>
        }
        subtitle="Sua doação sustenta o cursinho popular, mutirões de solidariedade e oficinas culturais. Transformação que acontece no território."
      />

      <DoacoesForm />
    </PageLayout>
  );
}
