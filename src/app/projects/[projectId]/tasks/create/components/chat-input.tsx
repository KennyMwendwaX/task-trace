import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("./editor"), { ssr: false });

export default function ChatInput() {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="w-full">
      <Editor
        variant="create"
        placeholder="Task description"
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
}
