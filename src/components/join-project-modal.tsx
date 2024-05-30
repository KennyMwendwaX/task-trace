"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LuUserPlus2 } from "react-icons/lu";

export default function JoinProjectModal() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1">
            <LuUserPlus2 className="w-5 h-5" />
            <span>Join Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Join Project</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
