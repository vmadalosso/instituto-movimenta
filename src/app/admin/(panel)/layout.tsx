import { countUnreadContato } from "@/lib/db/contato";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const unreadContato = await countUnreadContato();

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar unreadContato={unreadContato} />
      <main className="flex-1 min-w-0 p-4 lg:p-8">{children}</main>
    </div>
  );
}
