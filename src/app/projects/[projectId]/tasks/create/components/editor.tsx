import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LuSmile } from "react-icons/lu";
import { PiTextAa } from "react-icons/pi";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";

interface EditorProps {
  variant?: "create" | "edit";
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

export default function Editor({
  variant,
  placeholder,
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  console.log({ isEmpty, text });
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-48 ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button
              size="icon"
              variant={isToolbarVisible ? "default" : "ghost"}
              onClick={() => toggleToolbar()}>
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={false} size="icon" variant="ghost">
              <LuSmile className="size-4" />
            </Button>
          </EmojiPopover>
        </div>
      </div>
    </div>
  );
}
