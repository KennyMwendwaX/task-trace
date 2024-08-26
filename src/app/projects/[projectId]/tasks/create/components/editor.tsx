import { Button } from "@/components/ui/button";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import { LuImage, LuSmile } from "react-icons/lu";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
    };

    const quill = new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Button
            disabled={false}
            size="icon"
            variant="ghost"
            onClick={() => {}}>
            <PiTextAa className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="icon"
            variant="ghost"
            onClick={() => {}}>
            <LuSmile className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="icon"
            variant="ghost"
            onClick={() => {}}>
            <LuImage className="size-4" />
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
            size="icon">
            <MdSend className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
