"use client";

export default function Task({ params }: { params: { slug: string } }) {
  const id = params.slug;
  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        <div className="text-2xl font-bold tracking-tight">Task</div>
      </div>
    </>
  );
}
