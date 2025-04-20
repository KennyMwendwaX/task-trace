"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import TableToolbar from "./table-toolbar";
import TablePagination from "./table-pagination";
import { IoDownloadOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { downloadExcel, ExcelExportService } from "@/lib/excel";
import { format } from "date-fns";
import { ProjectMember } from "@/database/schema";
import { UserRoundPlus } from "lucide-react";

interface MemberTableProps<TData, TValue> {
  columns: ColumnDef<ProjectMember, TValue>[];
  data: ProjectMember[];
  projectId: number;
}

export default function MemberTable<TData, TValue>({
  columns,
  data,
  projectId,
}: MemberTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleExportExcel = async () => {
    const excelService = new ExcelExportService();
    const blob = await excelService.exportMembers(data);
    downloadExcel(blob, `members-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <>
      <div className="space-y-4 pt-4">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
          <TableToolbar table={table} />
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <Link href={`/projects/${projectId}/members/requests`}>
              <Button className="flex items-center gap-1 rounded-3xl">
                <UserRoundPlus className="w-5 h-5 text-white" />
                <span>Manage Requests</span>
              </Button>
            </Link>
            <Button
              onClick={handleExportExcel}
              className="flex items-center gap-1">
              <IoDownloadOutline className="w-5 h-5" />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>
    </>
  );
}
