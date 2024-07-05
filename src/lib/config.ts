import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "FEATURE",
    label: "Feature",
  },
  {
    value: "DOCUMENTATION",
    label: "Documentation",
  },
  {
    value: "BUG",
    label: "Bug",
  },
  {
    value: "ERROR",
    label: "Error",
  },
] as const;

export const statuses = [
  {
    value: "TO_DO",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "CANCELED",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
] as const;

export const priorities = [
  {
    label: "Low",
    value: "LOW",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "HIGH",
    icon: ArrowUpIcon,
  },
] as const;

export const projectStatuses = [
  {
    label: "Live",
    value: "LIVE",
  },
  {
    label: "Building",
    value: "BUILDING",
  },
] as const;

export const projectRoles = [
  {
    label: "Owner",
    value: "OWNER",
  },
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Member",
    value: "MEMBER",
  },
] as const;

export type Label = (typeof labels)[number]["value"];
export type Status = (typeof statuses)[number]["value"];
export type Priority = (typeof priorities)[number]["value"];
export type ProjectStatus = (typeof projectStatuses)[number]["value"];
export type ProjectRole = (typeof projectRoles)[number]["value"];
