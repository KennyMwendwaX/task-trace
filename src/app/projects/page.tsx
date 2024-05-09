"use client";

import AddProjectModal from "@/components/AddProjectModal";
import Loading from "@/components/Loading";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/schema/ProjectSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdOutlineAddTask } from "react-icons/md";

export default function Projects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/projects");
      return data.projects as Project[];
    },
  });

  const projects = data || [];

  return (
    <>
      {/* {isLoading ? (
        <Loading />
      ) : projects.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
            <AddProjectModal />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <MdOutlineAddTask className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">No projects added</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            You have not added any projects. Add one below.
          </p>
          <AddProjectModal />
        </div>
      )} */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
        <AddProjectModal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </>
  );
}
