"use client";

import Link from "next/link";
import { RepostWithUser } from "./timeline";
import { formatRelativeTime } from "@/libs/utils";
import Image from "next/image";
import PostPreviewButtons from "./buttons/post-preview-buttons";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";

interface RepostPreviewProps {
  repost: RepostWithUser;
  userId: number;
}

export default function RepostPreview({
  repost: {
    user: repostUser,
    post: {
      id: postId,
      content,
      tags,
      _count,
      reposts,
      user: postUser,
      created_at: postCreatedAt,
    },
  },
  userId,
}: RepostPreviewProps) {
  const isUserPost = Number(postUser.id) === userId;
  const isUserReposted = reposts.some((repost) => repost?.id);

  return (
    <Link href={`/posts/${postId}`}>
      <div className="w-full p-4 text-left flex flex-col gap-3">
        <div className="flex items-center gap-2 text-neutral-400">
          <ArrowPathRoundedSquareIcon className="size-3" />
          <p className="text-xs">{repostUser.username} 님이 공감했어요</p>
        </div>
        {/* 프로필 */}
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src={postUser.avatar ?? ""}
              alt={postUser.username}
              width={40}
              height={40}
              className="size-10 rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm"
            />
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">{postUser.username}</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-400">
            {formatRelativeTime(postCreatedAt)}
          </p>
        </section>

        {/* 본문 & 태그 */}
        <p>{content}</p>
        <p className="text-sm text-neutral-400">{tags}</p>

        {/* 버튼부 */}
        <PostPreviewButtons
          postId={postId}
          isUserReposted={isUserReposted}
          isUserPost={isUserPost}
          repostCount={_count.reposts}
          commentCount={_count.comments}
        />
      </div>
    </Link>
  );
}
