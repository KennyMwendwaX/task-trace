import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-8 w-[130px]" />
      <Skeleton className="h-6 w-[500px] mt-2" />

      <Skeleton className="h-10 w-[600px] mt-2" />
      <div className="bg-white rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-8 w-[180px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[130px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[130px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[130px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[40px]" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[40px]" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[40px]" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[40px]" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[130px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[40px]" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
