"use client";

import Link from "next/link";
import { PostWithUser } from "./timeline";
import { formatRelativeTime } from "@/libs/utils";
import Image from "next/image";
import PostPreviewButtons from "./buttons/post-preview-buttons";

interface PostPreviewProps {
  post: PostWithUser;
  userId: number;
}

export default function PostPreview({
  post: { id, user, content, tags, created_at, _count, reposts },
  userId,
}: PostPreviewProps) {
  const isUserPost = Number(user.id) === userId;
  const isUserReposted = reposts.some((repost) => repost?.id);

  return (
    <Link href={`/posts/${id}`}>
      <div className="w-full p-4 text-left flex flex-col gap-3">
        {/* 프로필 */}
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src={user.avatar ?? ""}
              alt={user.username}
              width={40}
              height={40}
              className="size-10 rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm"
            />
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
        <PostPreviewButtons
          postId={id}
          isUserReposted={isUserReposted}
          isUserPost={isUserPost}
          repostCount={_count.reposts}
          commentCount={_count.comments}
        />
      </div>
    </Link>
  );
}
