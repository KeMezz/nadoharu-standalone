"use client";

import { repost, unrepost } from "@/app/posts/[id]/action";
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { startTransition, useOptimistic } from "react";

interface PostPreviewButtonsProps {
  postId: number;
  isUserReposted: boolean;
  isUserPost: boolean;
  repostCount: number;
  commentCount: number;
}

export default function PostPreviewButtons({
  postId,
  isUserReposted,
  isUserPost,
  repostCount,
  commentCount,
}: PostPreviewButtonsProps) {
  const [state, reducerFn] = useOptimistic(
    { isUserReposted, repostCount },
    (prevState) => ({
      isUserReposted: !prevState.isUserReposted,
      repostCount: prevState.isUserReposted
        ? prevState.repostCount - 1
        : prevState.repostCount + 1,
    })
  );

  const onRepostClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    startTransition(() => reducerFn(undefined));
    if (isUserReposted) {
      await unrepost(postId);
    } else {
      await repost(postId);
    }
  };

  return (
    <div className="flex gap-2 self-end mt-4 text-neutral-600 dark:text-neutral-100">
      {!isUserPost ? (
        <button
          type="button"
          onClick={onRepostClick}
          className={`flex items-center gap-1 border py-1 px-2 rounded-md ${
            state.isUserReposted
              ? "text-white bg-violet-400 hover:bg-violet-300 border-violet-600 dark:border-violet-800"
              : "bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-700"
          }`}
        >
          <ArrowPathRoundedSquareIcon className="size-4" />
          <p className="text-sm">{state.repostCount}</p>
        </button>
      ) : (
        <div className="flex items-center gap-1 border py-1 px-2 rounded-md bg-white dark:bg-neutral-900 text-neutral-400 dark:border-neutral-400 cursor-not-allowed">
          <ArrowPathRoundedSquareIcon className="size-4" />
          <p className="text-sm">{state.repostCount}</p>
        </div>
      )}
      <div className="flex items-center gap-1 border py-1 px-2 rounded-md bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-700">
        <ChatBubbleOvalLeftEllipsisIcon className="size-4" />
        <p className="text-sm">{commentCount}</p>
      </div>
    </div>
  );
}
