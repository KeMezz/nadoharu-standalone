"use client";

import { repost, unrepost } from "@/app/(tabs)/posts/[id]/action";
import { cls } from "@/libs/utils";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";

interface RepostFormProps {
  postId: number;
  isReposted: boolean;
  repostCount: number;
}

export default function RepostForm({
  postId,
  isReposted,
  repostCount,
}: RepostFormProps) {
  const [state, reducerFn] = useOptimistic(
    { isReposted, repostCount },
    (prev) => ({
      isReposted: !prev.isReposted,
      repostCount: prev.isReposted
        ? prev.repostCount - 1
        : prev.repostCount + 1,
    })
  );

  const onRepostClick = async () => {
    startTransition(() => reducerFn(undefined));
    if (isReposted) {
      await unrepost(postId);
    } else {
      await repost(postId);
    }
  };

  return (
    <form action={onRepostClick}>
      <button
        className={cls(
          "flex items-center gap-1 border shadow-sm rounded-md px-3 py-2 text-sm",
          state.isReposted
            ? " bg-violet-400 text-white font-bold border-violet-800"
            : ""
        )}
      >
        <ArrowPathRoundedSquareIcon className="size-4" />
        <span>나도</span>
        <span>{state.repostCount}</span>
      </button>
    </form>
  );
}
