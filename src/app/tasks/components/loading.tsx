import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const skeletonWidths = {
  header: [180, 130, 130, 130],
  row: [180, 130, 130, 130, 40],
};

export default function Loading() {
  const renderSkeletonCells = (widths: number[]) =>
    widths.map((width, index) => (
      <TableCell
        key={index}
        className={index === widths.length - 1 ? "text-right" : ""}>
        <Skeleton className={`h-8 w-[${width}px]`} />
      </TableCell>
    ));

  return (
    <>
      <Skeleton className="h-8 w-[130px]" />
      <Skeleton className="h-6 w-[500px] mt-2" />

      <div className="bg-white rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              {skeletonWidths.header.map((width, index) => (
                <TableHead key={index}>
                  <Skeleton className={`h-8 w-[${width}px]`} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {renderSkeletonCells(skeletonWidths.row)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
