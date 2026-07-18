import { listContato } from "@/lib/db/contato";
import AdminDataTable from "@/components/admin/AdminDataTable";

export const metadata = { title: "Mensagens | Movimenta Admin" };

const COLUMNS = [
  { key: "created_at", label: "Data" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "WhatsApp" },
  { key: "subject", label: "Assunto" },
  { key: "message", label: "Mensagem" },
];

type Props = { searchParams: Promise<Record<string, string>> };

export default async function ContatoAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await listContato({
    page,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Mensagens de Contato</h1>
        <p className="text-foreground/60 text-sm mt-1">{total} mensagens no total</p>
      </div>
      <AdminDataTable
        tableName="mensagens_contato"
        columns={COLUMNS}
        rows={data}
        total={total}
        page={page}
        searchPlaceholder="E-mail"
        showLidaToggle
        csvFilename="mensagens-contato.csv"
      />
    </div>
  );
}
