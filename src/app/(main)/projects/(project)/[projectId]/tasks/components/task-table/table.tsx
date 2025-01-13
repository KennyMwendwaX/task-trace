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
import { useEffect, useState } from "react";
import TableToolbar from "./table-toolbar";
import TablePagination from "./table-pagination";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { IoDownloadOutline } from "react-icons/io5";
import { format } from "date-fns/format";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { downloadExcel, ExcelExportService } from "@/lib/excel";

interface TaskTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  projectId: string;
}

export default function TaskTable<TData, TValue>({
  columns,
  data,
  projectId,
}: TaskTableProps<TData, TValue>) {
  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tasks = data as ProjectTask[];

  const csvData = tasks.map((task) => ({
    name: task.name,
    status: task.status,
    priority: task.priority,
    assignedTo: task.member?.user?.name ?? "Unassigned",
    dueDate: format(task.dueDate, "dd/MM/yyyy"),
  }));

  const headers = [
    { label: "Task", key: "name" },
    { label: "Status", key: "status" },
    { label: "Priority", key: "priority" },
    { label: "Assigned To", key: "assignedTo" },
    { label: "Due Date", key: "dueDate" },
  ];

  const handleExportExcel = async () => {
    const tasks = data as ProjectTask[];
    const excelService = new ExcelExportService();
    const blob = await excelService.exportTasks(tasks);
    downloadExcel(blob, `tasks-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
          <TableToolbar table={table} />
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <Link href={`/projects/${projectId}/tasks/create`}>
              <Button className="flex items-center gap-1 rounded-3xl w-full sm:w-auto">
                <AiOutlinePlus className="w-4 h-4 text-white" />
                <span>Create Task</span>
              </Button>
            </Link>
            {isMounted && (
              <Button
                onClick={handleExportExcel}
                className="flex items-center gap-1">
                <IoDownloadOutline className="w-5 h-5" />
                <span>Export Excel</span>
              </Button>
            )}
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
