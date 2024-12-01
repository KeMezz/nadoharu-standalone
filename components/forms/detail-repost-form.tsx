"use client";

import { repost } from "@/app/(tabs)/posts/[id]/action";
import {
  ResponseWithAlert,
  useActionWithAlert,
} from "@/hooks/use-action-with-alert";
import { cls } from "@/libs/utils";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";

interface RepostFormProps {
  postId: number;
  isReposted: boolean;
}

export default function RepostForm({ postId, isReposted }: RepostFormProps) {
  const [, action] = useActionWithAlert<ResponseWithAlert>(
    async (prevState: ResponseWithAlert | void | null) => {
      const result = await repost(prevState, new FormData(), postId);
      return result;
    },
    { success: false }
  );

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
