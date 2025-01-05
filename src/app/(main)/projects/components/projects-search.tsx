"use client";

import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface ProjectsSearchProps {
  initialSearch: string;
}

export default function ProjectsSearch({ initialSearch }: ProjectsSearchProps) {
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchQuery = e.target.value;
      router.push(`/projects?search=${encodeURIComponent(searchQuery)}`, {
        scroll: false,
      });
    },
    [router]
  );

  return (
    <div className="relative w-full sm:w-auto sm:flex-grow">
      <LuSearch className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search projects..."
        className="w-full pl-8 rounded-lg bg-background sm:w-[200px] md:w-[400px]"
        defaultValue={initialSearch}
        onChange={handleSearch}
      />
    </div>
  );
}
