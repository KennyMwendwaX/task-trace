"use client";

import { ArrowUpIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { Editable, useEditor } from "@wysimark/react";
import { useState } from "react";

export default function Task() {
  const markdownText = `# Markdown Example

  ## Headings
  Markdown supports different heading levels:
  ### Heading 3
  #### Heading 4
  
  ## Lists
  You can create ordered lists and unordered lists:
  1. Ordered List Item 1
  2. Ordered List Item 2
     - Unordered Subitem 1
     - Unordered Subitem 2
  
  - Unordered List Item A
  - Unordered List Item B
  
  ## Text Formatting
  You can format text as **bold**, *italic*, or code
  - This is **bold text**.
  - This is *italic text*.
  - This is inline.
`;

  const [markdown, setMarkdown] = useState<string>(markdownText);
  const editor = useEditor({});

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-14">
        <div className="flex items-start">
          <div className="w-[800px]">
            <div className="text-2xl font-bold tracking-tight">
              Prototyping from A to Z: best practices for successful prototypes
            </div>
            <div className="flex items-center space-x-4 pt-2 pb-5">
              <div className="text-sm text-muted-foreground">
                Created on August 3, 2022, 2:20am
              </div>
              <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                Bug
              </span>
              <span className="text-gray-800 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-gray-500">
                <StopwatchIcon className="text-orange-600 mr-1.5" />
                In Progress
              </span>
              <span className="text-gray-800 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded border border-gray-500">
                <ArrowUpIcon className="text-red-600 mr-1.5" /> High
              </span>
            </div>
            <div className="">
              <div className="text-xl font-thin text-gray-700">
                <Editable
                  className="h-[600px]"
                  editor={editor}
                  value={markdownText}
                  onChange={setMarkdown}
                  throttleInMs={100}
                  placeholder="Task description..."
                />{" "}
              </div>
            </div>
          </div>

          <div>2</div>
        </div>
      </div>
    </>
  );
}
