type ProjectError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type MemberError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "FORBIDDEN"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type TaskError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type BookmarkError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type InvitationCodeError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export class ProjectActionError extends Error {
  constructor(
    public type: ProjectError["type"],
    message: ProjectError["message"],
    public action: string
  ) {
    super(message);
    this.name = "ProjectActionError";
  }
}

export class MemberActionError extends Error {
  constructor(
    public type: MemberError["type"],
    message: MemberError["message"],
    public action: string
  ) {
    super(message);
    this.name = "MemberActionError";
  }
}

export class TaskActionError extends Error {
  constructor(
    public type: TaskError["type"],
    message: TaskError["message"],
    public action: string
  ) {
    super(message);
    this.name = "TasksActionError";
  }
}

export class BookmarkActionError extends Error {
  constructor(
    public type: BookmarkError["type"],
    message: TaskError["message"],
    public action: string
  ) {
    super(message);
    this.name = "BookmarkActionError";
  }
}

export class InvitationCodeActionError extends Error {
  constructor(
    public type: InvitationCodeError["type"],
    message: InvitationCodeError["message"],
    public action: string
  ) {
    super(message);
    this.name = "InvitationCodeActionError";
  }
}
