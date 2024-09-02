import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "@/components/ui/use-toast";
import { deleteProject } from "@/lib/api/projects";

interface DangerZoneProps {
  projectId: string;
}

// const leaveProject = async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
//   const response = await fetch(`/api/project/${projectId}/members/${memberId}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to leave the project.");
//   }
//   return response.json();
// };

export default function DangerZone({ projectId }: DangerZoneProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  // const leaveMutation = useMutation({
  //   mutationFn: () => leaveProject({ projectId, memberId }),
  //   onSuccess: () => {
  //     toast({
  //       title: "Success",
  //       description: "You have left the project.",
  //     });
  //     queryClient.invalidateQueries({ queryKey: ["projects"] });
  //     router.push("/dashboard");
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Error",
  //       description: error.message || "An unexpected error occurred.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  const handleDeleteProject = () => {
    deleteMutation.mutate();
  };

  const handleLeaveProject = () => {
    // leaveMutation.mutate();
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
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveProject}
                  disabled={leaveMutation.isPending}>
                  {leaveMutation.isPending ? "Leaving..." : "Leave Project"}
                </Button> */}
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
                  disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
