import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./toolbar";
import { Level } from "@tiptap/extension-heading";

interface EditorProps {
  description: string;
  onChange: (richtext: string) => void;
}

export default function Editor({ description, onChange }: EditorProps) {
  const editor = useEditor({
    content: description,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "whitespace-pre-wrap",
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: ({ level }: { level: Level }) => {
              switch (level) {
                case 1:
                  return "text-2xl font-bold";
                case 2:
                  return "text-xl font-bold";
                case 3:
                  return "text-lg font-bold";
                default:
                  return "";
              }
            },
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Task description...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[300px] border border-input rounded-md">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-grow overflow-y-auto p-3"
      />
    </div>
  );
}
