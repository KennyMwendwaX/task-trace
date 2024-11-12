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
import { Member } from "@/lib/schema/MemberSchema";
import { IoDownloadOutline } from "react-icons/io5";
import { CSVLink } from "react-csv";
import { Status } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

interface MemberTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  projectId: string;
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

  const members = data as Member[];

  const getTasksByStatus = (user: Member, status: Status) => {
    const tasks = user.tasks;
    const tasksStatusList = tasks.filter((task) => task.status === status);
    return tasksStatusList.length;
  };

  const csvData = members.map((member) => ({
    name: member.user.name,
    role: member.role,
    tasks: member.tasks.length,
    tasksDone: getTasksByStatus(member, "DONE"),
    tasksTodo: getTasksByStatus(member, "TO_DO"),
    tasksInProgress: getTasksByStatus(member, "IN_PROGRESS"),
    tasksCanceled: getTasksByStatus(member, "CANCELED"),
  }));

  const headers = [
    { label: "Member", key: "name" },
    { label: "Role", key: "role" },
    { label: "Tasks Done", key: "tasksDone" },
    { label: "Tasks Todo", key: "tasksTodo" },
    { label: "Tasks In Progress", key: "tasksInProgress" },
    { label: "Tasks Canceled", key: "tasksCanceled" },
  ];

  return (
    <>
      <div className="space-y-4 pt-4">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
          <TableToolbar table={table} />
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <Link href={`/projects/${projectId}/members/requests`}>
              <Button className="flex items-center space-x-2 rounded-3xl">
                <AiOutlinePlus className="w-4 h-4 text-white" />
                <span>Add Member</span>
              </Button>
            </Link>
            <CSVLink
              data={csvData}
              headers={headers}
              filename="team"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
              <IoDownloadOutline className="mr-1 w-5 h-5 text-white" />
              <span>Export CSV</span>
            </CSVLink>
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
