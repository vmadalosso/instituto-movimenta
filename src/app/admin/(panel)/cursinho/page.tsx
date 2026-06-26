import { listCursinho } from "@/lib/db/cursinho";
import AdminDataTable from "@/components/admin/AdminDataTable";

export const metadata = { title: "Cursinho | Movimenta Admin" };

const COLUMNS = [
  { key: "created_at", label: "Data" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" },
  { key: "city", label: "Cidade" },
  { key: "state", label: "Estado" },
  { key: "neighborhood", label: "Bairro" },
  { key: "school", label: "Escola" },
  { key: "shift", label: "Turno" },
];

type Props = { searchParams: Promise<Record<string, string>> };

export default async function CursinhoAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await listCursinho({
    page,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Inscrições — Cursinho</h1>
        <p className="text-foreground/60 text-sm mt-1">{total} inscrições no total</p>
      </div>
      <AdminDataTable
        tableName="cursinho_inscricoes"
        columns={COLUMNS}
        rows={data}
        total={total}
        page={page}
        searchPlaceholder="Nome, e-mail, telefone ou cidade"
        csvFilename="cursinho-inscricoes.csv"
      />
    </div>
  );
}
