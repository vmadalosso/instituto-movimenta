import { listVoluntarios } from "@/lib/db/voluntarios";
import AdminDataTable from "@/components/admin/AdminDataTable";

export const metadata = { title: "Voluntários | Movimenta Admin" };

const COLUMNS = [
  { key: "created_at", label: "Data" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" },
  { key: "city", label: "Cidade" },
  { key: "state", label: "Estado" },
  { key: "instagram", label: "Instagram" },
  { key: "interest", label: "Interesse" },
  { key: "is_student", label: "Estudante?" },
  { key: "school_or_university", label: "Escola/Univ." },
  { key: "how_found", label: "Como conheceu" },
];

type Props = { searchParams: Promise<Record<string, string>> };

export default async function VoluntariosAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await listVoluntarios({
    page,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    city: params.city,
    interest: params.interest,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Voluntários</h1>
        <p className="text-foreground/60 text-sm mt-1">
          {total} voluntário{total !== 1 ? "s" : ""} no total
        </p>
      </div>
      <AdminDataTable
        tableName="voluntarios"
        columns={COLUMNS}
        rows={data}
        total={total}
        page={page}
        showCityFilter
        showInterestFilter
        csvFilename="voluntarios.csv"
      />
    </div>
  );
}
