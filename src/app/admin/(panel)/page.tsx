import Link from "next/link";
import { GraduationCap, HandHeart, MessageSquare, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { countCursinho } from "@/lib/db/cursinho";
import { countVoluntarios } from "@/lib/db/voluntarios";
import { countContato, countUnreadContato } from "@/lib/db/contato";
import { countNewsletter } from "@/lib/db/newsletter";

export const metadata = { title: "Dashboard | Movimenta Admin" };

const CARDS = [
  {
    label: "Inscrições Cursinho",
    icon: GraduationCap,
    href: "/admin/cursinho",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Voluntários",
    icon: HandHeart,
    href: "/admin/voluntarios",
    color: "text-highlight",
    bg: "bg-highlight/10",
  },
  {
    label: "Mensagens",
    icon: MessageSquare,
    href: "/admin/contato",
    color: "text-sky",
    bg: "bg-sky/10",
  },
  {
    label: "Newsletter",
    icon: Mail,
    href: "/admin/newsletter",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default async function AdminDashboard() {
  const [cursinho, voluntarios, contato, newsletter, unread] = await Promise.all([
    countCursinho(),
    countVoluntarios(),
    countContato(),
    countNewsletter(),
    countUnreadContato(),
  ]);

  const counts = [cursinho, voluntarios, contato, newsletter];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-foreground/60 mt-1 text-sm">Resumo geral dos registros</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map(({ label, icon: Icon, href, color, bg }, i) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-elevated transition-shadow cursor-pointer border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  {href === "/admin/contato" && unread > 0 && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      {unread} não lida{unread > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl font-display font-bold text-foreground">
                  {counts[i]}
                </CardTitle>
                <p className="text-sm text-foreground/60 mt-0.5">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
