import { Mail, MapPin, Instagram } from "lucide-react";
import { PageLayout, PageHero } from "@/components/PageLayout";
import ContatoForm from "./ContatoForm";

export const metadata = {
  title: "Contato — Instituto Movimenta",
  description: "Fale com o Instituto Movimenta. Parcerias, imprensa, voluntariado e dúvidas.",
};

export default function Contato() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Vamos <span className="text-accent">conversar</span>?
          </>
        }
        subtitle="Parcerias, imprensa, dúvidas ou só pra dizer um olá — escreve pra gente."
      />

      <ContatoForm />
    </PageLayout>
  );
}
