import { Post, Repost } from "@prisma/client";
import PostPreview from "./post-preview";
import EmptyStateFooter from "@/components/layouts/empty-state-has-footer";

export interface PostWithUser extends Post {
  user: {
    username: string;
    login_id: string;
    avatar: string | null;
  };
  _count: {
    comments: number;
    reposts: number;
  };
}

export interface RepostWithUser extends Repost {
  user: {
    username: string;
    login_id: string;
    avatar: string | null;
  };
  post: PostWithUser;
}

interface TimelineProps {
  posts: PostWithUser[];
  reposts: RepostWithUser[];
}

export default function Timeline({ posts, reposts }: TimelineProps) {
  const allPosts = [...posts, ...reposts];
  allPosts.sort(
    (prev, curr) =>
      new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
  );

  return (
    <section className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-600">
      {allPosts.length ? (
        allPosts.map((post) =>
          "content" in post ? <PostPreview post={post} key={post.id} /> : null
        )
      ) : (
        <EmptyStateFooter text="당신은 친구도 없고 글도 없네요 호호" />
      )}
    </section>
  );
}
