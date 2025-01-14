import { Editor } from "@tiptap/react";
import {
  LuBold,
  LuStrikethrough,
  LuItalic,
  LuList,
  LuListOrdered,
  LuTextQuote,
  LuCode2,
  LuUndo,
  LuRedo,
} from "react-icons/lu";
import { Toggle } from "@/components/ui/toggle";
import Hint from "./hint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const setTextStyle = (value: string) => {
    editor.chain().focus();

    switch (value) {
      case "Normal":
        editor.chain().focus().setParagraph().run();
        break;
      case "Heading1":
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case "Heading2":
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case "Heading3":
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
    }
  };

  return (
    <ScrollArea className="w-full border-b">
      <div className="flex items-center gap-1 p-1">
        <Select
          onValueChange={setTextStyle}
          defaultValue="Normal"
          value={
            editor.isActive("heading", { level: 1 })
              ? "Heading1"
              : editor.isActive("heading", { level: 2 })
              ? "Heading2"
              : editor.isActive("heading", { level: 3 })
              ? "Heading3"
              : "Normal"
          }>
          <SelectTrigger className="w-[150px] border-none focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Heading1">Heading 1</SelectItem>
            <SelectItem value="Heading2">Heading 2</SelectItem>
            <SelectItem value="Heading3">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <Hint label="Bold">
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}>
            <LuBold className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Italic">
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
            <LuItalic className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Strikethrough">
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
            <LuStrikethrough className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Bullet list">
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }>
            <LuList className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Ordered list">
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }>
            <LuListOrdered className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Block quote">
          <Toggle
            pressed={editor.isActive("blockquote")}
            onPressedChange={() =>
              editor.chain().focus().toggleBlockquote().run()
            }>
            <LuTextQuote className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Code">
          <Toggle
            pressed={editor.isActive("code")}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}>
            <LuCode2 className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Undo">
          <Toggle onPressedChange={() => editor.chain().focus().undo().run()}>
            <LuUndo className="h-4 w-4" />
          </Toggle>
        </Hint>
        <Hint label="Redo">
          <Toggle onPressedChange={() => editor.chain().focus().redo().run()}>
            <LuRedo className="h-4 w-4" />
          </Toggle>
        </Hint>
      </div>
    </ScrollArea>
  );
}
