"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/lib/try-catch";
import { joinPublicProject } from "@/server/actions/project/project";
import { cn } from "@/lib/utils";

interface JoinPublicProjectProps {
  projectId: string;
  projectName: string;
}

export default function JoinPublicProjectModal({
  projectId,
  projectName,
}: JoinPublicProjectProps) {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  const handleJoinProject = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(joinPublicProject(projectId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.success === true) {
        toast.success(`You've successfully joined ${projectName}`);
        toggleDialog();
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogContent
        className="w-[95vw] max-w-md lg:max-w-xl p-0 overflow-hidden rounded-xl shadow-lg"
        onInteractOutside={(e) => e.preventDefault()}>
        <div className="bg-primary p-6 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Join {projectName}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              This is a public project that anyone can join and contribute to
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 bg-background">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2 text-foreground">
                Join the collaboration
              </h3>
              <p className="text-muted-foreground">
                By joining this project, you&apos;ll be able to:
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-foreground">
                  <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span>View all project details and tasks</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span>Collaborate with other team members</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span>Contribute to tasks and track progress</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3">
            <Button
              onClick={handleJoinProject}
              className="w-full"
              size="lg"
              disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining Project...
                </>
              ) : (
                "Join This Project"
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 bg-background">
          <Link href="/explore" className="w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              size="lg">
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
