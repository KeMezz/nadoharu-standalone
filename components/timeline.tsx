import { Post, Repost, User } from "@prisma/client";
import PostPreview from "./post-preview";

export interface PostWithUser extends Post {
  user: User;
}

export interface RepostWithUser extends Repost {
  user: User;
  post: Post;
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
      {allPosts.map((post) =>
        "content" in post ? <PostPreview post={post} /> : null
      )}
      {/* <EmptyStateFooter text="친구도 없고 표시할 글도 없고.." /> */}
    </section>
  );
}
