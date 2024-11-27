"use client";

import { repost } from "@/app/(tabs)/posts/[id]/action";
import { cls } from "@/libs/utils";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";

interface RepostFormProps {
  postId: number;
  isReposted: boolean;
}

export default function RepostForm({ postId, isReposted }: RepostFormProps) {
  const [state, action] = useActionState(
    async (prevState: void | null | { error: string }, formData: FormData) =>
      repost(prevState, formData, postId),
    null
  );
  console.log(state);

  return (
    <form action={action}>
      <button
        className={cls(
          "flex items-center gap-1 border shadow-sm rounded-md px-3 py-2 text-sm",
          isReposted
            ? " bg-violet-400 text-white font-bold border-violet-800"
            : ""
        )}
      >
        <ArrowPathRoundedSquareIcon className="size-4" />
        나도
      </button>
    </form>
  );
}
