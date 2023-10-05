"use client";

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
import { Editable, useEditor } from "@wysimark/react";
import { useState } from "react";

export default function NewTask() {
  const [markdown, setMarkdown] = useState<string>("");
  const editor = useEditor({});
  return (
    <>
      <div className="container mx-auto mt-4 px-8 pb-5 pt-12">
        <div className="text-2xl font-bold tracking-tight">New Task</div>
        <div className="flex items-start pt-4">
          <div className="w-[800px]">
            <form className="space-y-5">
              <div className="sm:col-span-2">
                <Label className="font-semibold" htmlFor="title">
                  Title
                </Label>
                <Input type="title" id="title" placeholder="Title" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="font-semibold" htmlFor="select">
                    Label
                  </Label>
                  <Select>
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
              <Button variant="default">Add New Task</Button>
            </form>
          </div>
          <div className="">2</div>
        </div>
      </div>
    </>
  );
}
