import CommentSkeleton from "@/components/skeletons/comment";

export default function PostDetailLoading() {
  return (
    <section className="divide-y pb-16">
      {/* 본문 */}
      <div className="flex flex-col p-4 gap-2 shadow-md">
        <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
        <div className="w-60 h-4 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
        <div className="mt-2 w-44 h-3 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
        <div className="flex justify-between pt-6 items-center">
          <div className="w-10 h-4 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
          <div className="flex gap-4 items-center">
            <div className="w-12 h-5 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
            <div className="w-12 h-5 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      <div>
        {/* 나도 */}
        <div className="flex items-center gap-4 p-4 border-b">
          <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-600 rounded-md animate-pulse" />
        </div>
        {[...Array(3)].map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
