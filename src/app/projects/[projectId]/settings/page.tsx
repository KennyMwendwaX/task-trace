"use client";

import ProjectNotFound from "../components/project-not-found";
import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";
import ProjectInvite from "./components/project-invite";
import { useProjectStore } from "@/hooks/useProjectStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LuSettings } from "react-icons/lu";
import { useState } from "react";

// export default function Settings({
//   params,
// }: {
//   params: { projectId: string };
// }) {
//   const projectId = params.projectId;

//   // const { isLoading: projectIsLoading } = useProjectQuery(projectId);

//   const { project } = useProjectStore();

//   // if (!project) {
//   //   return <ProjectNotFound />;
//   // }

//   return (
//     <>
//       <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
//         <div className="text-2xl font-bold tracking-tight">
//           Go concurrency model Settings
//         </div>
//         <div className="flex flex-col-reverse lg:flex-row gap-4 items-start mt-2">
//           <div className="w-full flex flex-col gap-4">
//             <UpdateProjectDetails />
//             <ProjectVisibility />
//             <DangerZone />
//           </div>
//           <ProjectInvite />
//         </div>
//       </main>
//     </>
//   );
// }
export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { project } = useProjectStore();

  // if (!project) {
  //   return <div>Project not found</div>;
  // }

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {project?.name} Settings
        </h1>
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <LuSettings className="w-4 h-4" />
              Update Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Project Details</DialogTitle>
              <DialogDescription>
                Make changes to your project here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <UpdateProjectDetails
              onSuccess={() => setIsUpdateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ProjectVisibility />
          <DangerZone />
        </div>
        <ProjectInvite />
      </div>
    </main>
  );
}
