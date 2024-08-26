import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./editor"), { ssr: false });

export default function ChatInput() {
  return (
    <>
      <div className="w-full">
        <Editor />
      </div>
    </>
  );
}
