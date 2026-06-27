import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Admin — Login | Instituto Movimenta",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-1">
            Instituto Movimenta
          </p>
          <h1 className="font-display text-3xl font-bold text-primary">Painel Admin</h1>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-elevated">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
