import { Post, Repost } from "@prisma/client";
import PostPreview from "@/components/domains/post/preview";
import EmptyState from "@/components/layouts/empty-state";

export interface PostWithUser extends Post {
  user: {
    id: number;
    username: string;
    loginId: string;
    avatar: string | null;
  };
  reposts: { id?: number }[];
  _count: {
    comments: number;
    reposts: number;
  };
}

export interface RepostWithUser extends Repost {
  user: {
    id: number;
    username: string;
    loginId: string;
    avatar: string | null;
  };
  post: PostWithUser;
}

interface TimelineProps {
  posts: PostWithUser[];
  reposts: RepostWithUser[];
  userId: number;
}

export default function Timeline({ posts, reposts, userId }: TimelineProps) {
  // 원본 포스트의 ID 목록
  const originalPostIds = new Set(posts.map((post) => post.id));

  // reposts에서 원본 포스트와 중복되는 것 제외
  const filteredReposts = reposts.filter(
    (repost) => !originalPostIds.has(repost.post.id)
  );

  const allPosts = [...posts, ...filteredReposts].sort(
    (prev, curr) =>
      new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime()
  );

  return (
    <section className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-600">
      {allPosts.length ? (
        allPosts.map((post) =>
          "content" in post ? (
            <PostPreview key={post.id} post={post} userId={userId} />
          ) : (
            <PostPreview
              key={post.id}
              post={post.post}
              userId={userId}
              repostUser={post.user}
            />
          )
        )
      ) : (
        <EmptyState text="조금 허전한데요" />
      )}
    </section>
  );
}
