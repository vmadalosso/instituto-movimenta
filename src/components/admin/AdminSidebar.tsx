"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  GraduationCap,
  HandHeart,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cursinho", label: "Cursinho", icon: GraduationCap },
  { href: "/admin/voluntarios", label: "Voluntários", icon: HandHeart },
  { href: "/admin/contato", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

type Props = { unreadContato: number };

export default function AdminSidebar({ unreadContato }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavLinks = () => (
    <nav className="flex-1 py-4 space-y-0.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {href === "/admin/contato" && unreadContato > 0 && (
              <Badge className="bg-accent text-accent-foreground text-xs px-1.5 py-0 min-w-[1.25rem] justify-center">
                {unreadContato}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-20">
        <span className="font-display font-bold text-primary text-lg">Movimenta Admin</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-secondary"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-10 flex">
          <div className="w-64 bg-card border-r border-border flex flex-col h-full shadow-elevated">
            <div className="px-4 pt-5 pb-3 border-b border-border">
              <p className="font-display font-bold text-primary text-lg">Movimenta Admin</p>
            </div>
            <NavLinks />
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-foreground/60 hover:text-destructive transition-colors w-full"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-card h-screen sticky top-0">
        <div className="px-4 pt-6 pb-4 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/50 mb-0.5">
            Instituto Movimenta
          </p>
          <p className="font-display font-bold text-primary text-lg leading-tight">Admin</p>
        </div>
        <NavLinks />
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="h-4 w-4" /> Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
