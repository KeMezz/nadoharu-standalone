"use client";

import Link from "next/link";
import { PostWithUser } from "./timeline";
import { formatRelativeTime } from "@/libs/utils";
import PostPreviewButtons from "./buttons/post-preview-buttons";
import { useRouter } from "next/navigation";
import ProfileImage from "./profile-image";

interface PostPreviewProps {
  post: PostWithUser;
  userId: number;
}

export default function PostPreview({
  post: { id, user, content, tags, created_at, _count, reposts },
  userId,
}: PostPreviewProps) {
  const router = useRouter();
  const isUserPost = Number(user.id) === userId;
  const isUserReposted = reposts.some((repost) => repost?.id);

  const goToUserPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/users/${user.login_id}`);
  };

  return (
    <Link href={`/posts/${id}`}>
      <div className="w-full p-4 text-left flex flex-col gap-3">
        {/* 프로필 */}
        <section className="flex justify-between items-center">
          <button onClick={goToUserPage} className="flex items-center gap-3">
            <ProfileImage avatar={user.avatar} username={user.username} />
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">{user.username}</h2>
            </div>
          </button>
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
