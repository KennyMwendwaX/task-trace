import { Button } from "@/components/ui/button";

interface TableColumnHeaderProps {
  title: string;
}

export default function TableColumnHeader<TData, TValue>({
  title,
}: TableColumnHeaderProps) {
  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-3 h-8">
        <span>{title}</span>
      </Button>
    </>
  );
}
