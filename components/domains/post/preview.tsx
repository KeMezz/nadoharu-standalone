"use client";

import Link from "next/link";
import { PostWithUser } from "@/components/domains/post/timeline";
import { formatRelativeTime } from "@/libs/utils";
import PostPreviewButtons from "@/components/domains/post/preview-buttons";
import { useRouter } from "next/navigation";
import ProfileImage from "@/components/domains/profile/image";
import Image from "next/image";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";

interface PostPreviewProps {
  post: PostWithUser;
  userId: number;
  repostUser?: {
    id: number;
    username: string;
    loginId: string;
    avatar: string | null;
  };
}

export default function PostPreview({
  post: { id, user, content, tags, photos, createdAt, _count, reposts },
  userId,
  repostUser,
}: PostPreviewProps) {
  const router = useRouter();
  const isUserPost = Number(user.id) === userId;
  const isUserReposted = reposts.some((repost) => repost?.id);

  const goToUserPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/users/${user.loginId}`);
  };

  return (
    <Link href={`/posts/${id}`}>
      <div className="w-full p-4 text-left flex flex-col gap-3">
        {repostUser ? (
          <div className="flex items-center gap-2 text-neutral-400">
            <ArrowPathRoundedSquareIcon className="size-3" />
            <p className="text-xs">{repostUser.username} 님이 공감했어요</p>
          </div>
        ) : null}

        {/* 프로필 */}
        <section className="flex justify-between items-center">
          <button onClick={goToUserPage} className="flex items-center gap-3">
            <ProfileImage avatar={user.avatar} username={user.username} />
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">{user.username}</h2>
            </div>
          </button>
          <p className="text-sm text-neutral-400">
            {formatRelativeTime(createdAt)}
          </p>
        </section>

        {/* 본문 & 태그 */}
        <p>{content}</p>
        <p className="text-sm text-neutral-400">{tags}</p>

        {/* 이미지 */}
        {photos.length ? (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <Image
                key={photo}
                src={photo + "/avatar"}
                alt="post-photo"
                className="rounded-md aspect-video object-cover shadow-sm"
                width={1600}
                height={1000}
              />
            ))}
          </div>
        ) : null}

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
