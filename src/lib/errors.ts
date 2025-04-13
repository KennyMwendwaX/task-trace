export type ProjectError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export class ProjectActionError extends Error {
  constructor(
    public type: ProjectError["type"],
    message: ProjectError["message"],
    public action?: string
  ) {
    super(message);
    this.name = "ProjectActionError";
  }
}
