"use client";

import Link from "next/link";
import { PostWithUser } from "./timeline";
import { formatRelativeTime } from "@/libs/utils";
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

interface PostPreviewProps {
  post: PostWithUser;
}

export default function PostPreview({
  post: { id, user, content, tags, created_at },
}: PostPreviewProps) {
  return (
    <Link href={`/posts/${id}`}>
      <div className="w-full p-4 text-left flex flex-col gap-3">
        {/* 프로필 */}
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-600 shrink-0 rounded-md" />
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">{user.username}</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-400">
            {formatRelativeTime(created_at)}
          </p>
        </section>

        {/* 본문 & 태그 */}
        <p>{content}</p>
        <p className="text-sm text-neutral-400">{tags}</p>

        {/* 버튼부 */}
        <div className="flex gap-2 self-end mt-4 text-neutral-600 dark:text-neutral-100">
          <button className="flex items-center gap-1 border py-1 px-2 rounded-md bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-700">
            <ArrowPathRoundedSquareIcon className="size-4" />
            <p className="text-sm">0</p>
          </button>
          <button className="flex items-center gap-1 border py-1 px-2 rounded-md bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-700">
            <ChatBubbleOvalLeftEllipsisIcon className="size-4" />
            <p className="text-sm">0</p>
          </button>
        </div>
      </div>
    </Link>
  );
}
