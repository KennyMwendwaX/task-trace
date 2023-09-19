"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Issues() {
  return (
    <>
      <div className="container mx-auto mt-4 px-5 pb-5 pt-12">
        Issues
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem defaultChecked value="all-issues">
                All Issues
              </SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
