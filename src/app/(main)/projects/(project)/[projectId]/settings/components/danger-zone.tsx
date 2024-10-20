import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useDeleteProjectMutation,
  useLeaveProjectMutation,
} from "@/hooks/useProjectQueries";
import { useSession } from "next-auth/react";

interface DangerZoneProps {
  projectId: string;
}

export default function DangerZone({ projectId }: DangerZoneProps) {
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user?.id;

  const { mutate: leaveProject, isPending: isLeavingProject } =
    useLeaveProjectMutation(projectId, userId);

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProjectMutation(projectId);

  const handleLeaveProject = () => {
    leaveProject(undefined, {
      onSuccess: () => {
        toast.success("Project has been deleted!");
        router.push("/dashboard");
      },
      onError: () => {
        toast.error("Failed to leave project");
      },
    });
  };

  const handleDeleteProject = () => {
    deleteProject(undefined, {
      onSuccess: () => {
        toast.success("Project has been deleted!");
        router.push("/dashboard");
      },
      onError: () => {
        toast.error("Failed to delete project");
      },
    });
  };

  return (
    <Card className="border-red-300 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Leave Project */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-t border-gray-200">
          <div className="mb-2 sm:mb-0 text-left">
            <h3 className="text-sm font-medium">Leave Project</h3>
            <p className="text-sm text-gray-500">
              You will lose access to this project
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-red-500">
                Leave Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-left">
                <DialogTitle>
                  Are you sure you want to leave this project?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. You will lose all access to this
                  project.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveProject}
                  disabled={isLeavingProject}>
                  {isLeavingProject ? "Leaving..." : "Leave Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Project */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-t border-gray-200">
          <div className="mb-2 sm:mb-0 text-left">
            <h3 className="text-sm font-medium">Delete project</h3>
            <p className="text-sm text-gray-500">
              Once you delete a project, there is no going back.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="self-start sm:self-center">
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-left">
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and remove all associated data.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteProject}
                  disabled={isDeletingProject}>
                  {isDeletingProject ? "Deleting..." : "Delete Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
