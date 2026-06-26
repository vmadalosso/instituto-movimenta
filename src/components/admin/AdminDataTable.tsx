"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteRecord, toggleLida } from "@/lib/actions/admin";
import DeleteConfirmModal from "./DeleteConfirmModal";

type TableName = "cursinho_inscricoes" | "voluntarios" | "mensagens_contato" | "newsletter_emails";

type Column = {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

type Props = {
  tableName: TableName;
  columns: Column[];
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize?: number;
  searchPlaceholder?: string;
  showInterestFilter?: boolean;
  showLidaToggle?: boolean;
  csvFilename: string;
};

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return String(value);
}

function downloadCsv(columns: Column[], rows: Record<string, unknown>[], filename: string) {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = row[c.key];
          return `"${formatCell(raw).replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataTable({
  tableName,
  columns,
  rows,
  total,
  page,
  pageSize = 50,
  searchPlaceholder,
  showInterestFilter,
  showLidaToggle,
  csvFilename,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (id: string) => {
    await deleteRecord(tableName, id as Parameters<typeof deleteRecord>[1]);
    router.refresh();
  };

  const handleToggleLida = (id: string, currentLida: boolean) => {
    startTransition(async () => {
      await toggleLida(id, !currentLida);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Data inicial</label>
          <Input
            type="date"
            className="w-40 text-sm"
            defaultValue={searchParams.get("dateFrom") ?? ""}
            onChange={(e) => updateParam("dateFrom", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Data final</label>
          <Input
            type="date"
            className="w-40 text-sm"
            defaultValue={searchParams.get("dateTo") ?? ""}
            onChange={(e) => updateParam("dateTo", e.target.value)}
          />
        </div>
        {searchPlaceholder && (
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">Buscar</label>
            <Input
              placeholder={searchPlaceholder}
              className="w-64 text-sm"
              defaultValue={searchParams.get("search") ?? ""}
              onChange={(e) => updateParam("search", e.target.value)}
            />
          </div>
        )}
        {showInterestFilter && (
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">Filtrar por interesse</label>
            <Select
              value={searchParams.get("interest") ?? ""}
              onValueChange={(value) => updateParam("interest", value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-44 text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Cultura">Cultura</SelectItem>
                <SelectItem value="Lazer">Lazer</SelectItem>
                <SelectItem value="Solidariedade">Solidariedade</SelectItem>
                <SelectItem value="Meio ambiente">Meio ambiente</SelectItem>
                <SelectItem value="Comunicação">Comunicação</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 ml-auto"
          onClick={() => downloadCsv(columns, rows, csvFilename)}
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-foreground/80 text-xs">
                  {col.label}
                </TableHead>
              ))}
              {showLidaToggle && (
                <TableHead className="font-semibold text-foreground/80 text-xs">Status</TableHead>
              )}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showLidaToggle ? 2 : 1)}
                  className="text-center text-foreground/50 py-12 text-sm"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const id = String(row.id);
                return (
                  <TableRow key={id} className="hover:bg-secondary/30 transition-colors">
                    {columns.map((col) => (
                      <TableCell key={col.key} className="text-sm py-3">
                        {col.render ? col.render(row[col.key], row) : formatCell(row[col.key])}
                      </TableCell>
                    ))}
                    {showLidaToggle && (
                      <TableCell className="py-3">
                        <button
                          onClick={() => handleToggleLida(id, Boolean(row.lida))}
                          className="cursor-pointer"
                        >
                          <Badge
                            className={
                              row.lida
                                ? "bg-secondary text-foreground/60"
                                : "bg-accent text-accent-foreground"
                            }
                          >
                            {row.lida ? "Lida" : "Nova"}
                          </Badge>
                        </button>
                      </TableCell>
                    )}
                    <TableCell className="py-3 text-right">
                      <DeleteConfirmModal onConfirm={() => handleDelete(id)} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-foreground/60">
          <span>
            {total} registro{total !== 1 ? "s" : ""} — página {page} de {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(page - 1));
                router.push(`${pathname}?${params.toString()}`);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(page + 1));
                router.push(`${pathname}?${params.toString()}`);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
