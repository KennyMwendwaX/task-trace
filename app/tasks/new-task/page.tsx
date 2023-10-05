"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { Editable, useEditor } from "@wysimark/react";
import { cn } from "@/lib/utils";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function NewTask() {
  const [markdown, setMarkdown] = useState<string>("");
  const editor = useEditor({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <div className="container mx-auto mt-4 px-8 pb-5 pt-12">
        <div className="text-2xl font-bold tracking-tight">New Task</div>
        <div className="flex items-start pt-4 space-x-6">
          <div className="w-[800px]">
            <form className="space-y-5">
              <div className="sm:col-span-2">
                <Label className="font-semibold" htmlFor="title">
                  Title
                </Label>
                <Input
                  className="focus:border-2 focus:border-blue-800"
                  type="title"
                  id="title"
                  placeholder="Title"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="font-semibold" htmlFor="select">
                    Label
                  </Label>
                  <Select>
                    <SelectTrigger className="focus:border-2 focus:border-blue-800">
                      <SelectValue placeholder="Select a Label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Labels</SelectLabel>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="documentation">
                          Documentation
                        </SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold" htmlFor="select">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="focus:border-2 focus:border-blue-800">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Statuses</SelectLabel>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="backlog">Backlog</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold" htmlFor="select">
                    Priority
                  </Label>
                  <Select>
                    <SelectTrigger className="focus:border-2 focus:border-blue-800">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priorities</SelectLabel>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label className="font-semibold" htmlFor="description">
                  Description
                </Label>
                <Editable
                  className="h-[300px]"
                  editor={editor}
                  value={markdown}
                  onChange={setMarkdown}
                />
              </div>
              <Button
                variant="default"
                className="flex items-center space-x-2 w-full">
                <PlusIcon />
                <span>Add New Task</span>
              </Button>
            </form>
          </div>
          <div>
            <div className="flex flex-col space-y-3">
              <Label className="font-semibold" htmlFor="combobox">
                Assign task
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger id="combobox" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between">
                    {value
                      ? frameworks.find(
                          (framework) => framework.value === value
                        )?.label
                      : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
