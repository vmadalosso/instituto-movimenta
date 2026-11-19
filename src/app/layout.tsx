import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Instituto Movimenta — A saída é coletiva",
  description:
    "ONG do Rio Grande do Sul que atua em solidariedade, educação, esporte, cultura e lazer.",
  metadataBase: new URL("https://institutomovimenta.org"),
  openGraph: {
    title: "Instituto Movimenta — A saída é coletiva",
    description:
      "ONG do Rio Grande do Sul que atua em solidariedade, educação, esporte, cultura e lazer.",
    type: "website",
  },
  // A imagem vem de src/app/opengraph-image.jpg; aqui só pedimos o cartão grande no X/Twitter.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
