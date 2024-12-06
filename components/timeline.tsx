import { Post, Repost } from "@prisma/client";
import PostPreview from "./post-preview";
import EmptyStateFooter from "@/components/layouts/empty-state-has-footer";
import RepostPreview from "./repost-preview";

export interface PostWithUser extends Post {
  user: {
    id: number;
    username: string;
    login_id: string;
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
    login_id: string;
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
  const allPosts = [...posts, ...reposts];
  allPosts.sort(
    (prev, curr) =>
      new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
  );

  return (
    <section className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-600">
      {allPosts.length ? (
        allPosts.map((post) =>
          "content" in post ? (
            <PostPreview key={post.id} post={post} userId={userId} />
          ) : (
            <RepostPreview key={post.post.id} repost={post} userId={userId} />
          )
        )
      ) : (
        <EmptyStateFooter text="당신은 친구도 없고 글도 없네요 호호" />
      )}
    </section>
  );
}
