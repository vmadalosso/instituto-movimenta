import { listNewsletter } from "@/lib/db/newsletter";
import AdminDataTable from "@/components/admin/AdminDataTable";

export const metadata = { title: "Newsletter | Movimenta Admin" };

const COLUMNS = [
  { key: "created_at", label: "Data" },
  { key: "email", label: "E-mail" },
];

type Props = { searchParams: Promise<Record<string, string>> };

export default async function NewsletterAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await listNewsletter({
    page,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Newsletter</h1>
        <p className="text-foreground/60 text-sm mt-1">
          {total} inscrição{total !== 1 ? "ões" : ""} no total
        </p>
      </div>
      <AdminDataTable
        tableName="newsletter_emails"
        columns={COLUMNS}
        rows={data}
        total={total}
        page={page}
        csvFilename="newsletter.csv"
      />
    </div>
  );
}
