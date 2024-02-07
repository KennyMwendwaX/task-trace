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
import TableToolbar from "./TableToolbar";
import TablePagination from "./TablePagination";
// import AddMemberModal from "@/components/AddMemberModal";
import { Member } from "@/lib/schema/UserSchema";
import { IoDownloadOutline } from "react-icons/io5";
import { CSVLink } from "react-csv";

interface MemberTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function MemberTable<TData, TValue>({
  columns,
  data,
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

  type Status = "TO_DO" | "IN_PROGRESS" | "DONE" | "CANCELED";

  const getTasksByStatus = (user: Member, status: Status) => {
    const tasks = user.tasks;
    const tasksStatusList = tasks.filter((task) => task.status === status);
    return tasksStatusList.length;
  };

  const csvData = members.map((member) => ({
    name: member.userName,
    email: member.userId,
    tasks: member.tasks.length,
    tasksDone: getTasksByStatus(member, "DONE"),
    tasksTodo: getTasksByStatus(member, "TO_DO"),
    tasksInProgress: getTasksByStatus(member, "IN_PROGRESS"),
    tasksCanceled: getTasksByStatus(member, "CANCELED"),
  }));

  const headers = [
    { label: "Member", key: "name" },
    { label: "Email", key: "email" },
    { label: "Tasks Done", key: "tasksDone" },
    { label: "Tasks Todo", key: "tasksTodo" },
    { label: "Tasks In Progress", key: "tasksInProgress" },
    { label: "Tasks Canceled", key: "tasksCanceled" },
  ];

  return (
    <>
      <div className="space-y-4 pt-4">
        <div className="flex justify-between">
          <TableToolbar table={table} />

          <div className="flex items-center space-x-2">
            {/* <AddMemberModal /> */}
            <CSVLink
              data={csvData}
              headers={headers}
              filename="team"
              className="inline-flex bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
              <IoDownloadOutline className="mr-1 w-5 h-5 text-white" />
              <span>Export CSV/Excel</span>
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
