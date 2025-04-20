import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./toolbar";
import { Level } from "@tiptap/extension-heading";

interface EditorProps {
  onChange: (richtext: string) => void;
}

export default function Editor({ onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: ({ level }: { level: Level }) => {
              switch (level) {
                case 1:
                  return "text-3xl font-bold mt-4 mb-2";
                case 2:
                  return "text-2xl font-bold mt-3 mb-2";
                case 3:
                  return "text-xl font-bold mt-2 mb-1";
                default:
                  return "";
              }
            },
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4 space-y-1",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4 my-4",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[200px]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[300px] border border-input rounded-md text-3xl">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-grow overflow-y-auto p-4"
      />
    </div>
  );
}
