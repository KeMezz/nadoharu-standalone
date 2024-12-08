import EmptyState from "./layouts/empty-state";
import PostPreview from "./post-preview";
import RepostPreview from "./repost-preview";
import { PostWithUser, RepostWithUser } from "./timeline";

interface UserTimelineProps {
  posts: PostWithUser[];
  reposts: RepostWithUser[];
  userId: number;
}

export default function UserTimeline({
  posts,
  reposts,
  userId,
}: UserTimelineProps) {
  // 원본 포스트의 ID 목록
  const originalPostIds = new Set(posts.map((post) => post.id));

  // reposts에서 원본 포스트와 중복되는 것 제외
  const filteredReposts = reposts.filter(
    (repost) => !originalPostIds.has(repost.post.id)
  );

  const allPosts = [...posts, ...filteredReposts].sort(
    (prev, curr) =>
      new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
  );

  return (
    <>
      <div className="grid grid-cols-3 h-12 border-b">
        <button className="text-violet-400 font-bold">이야기</button>
        <button>미디어</button>
        <button>미투함</button>
      </div>
      <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-600">
        {allPosts.length ? (
          allPosts.map((post) =>
            "content" in post ? (
              <PostPreview key={post.id} post={post} userId={userId} />
            ) : (
              <RepostPreview key={post.post.id} repost={post} userId={userId} />
            )
          )
        ) : (
          <EmptyState text="아직 글을 작성하지 않았나보네요!" />
        )}
      </div>
    </>
  );
}
