import Comment from "@/components/comment";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { formatRelativeTime } from "@/libs/utils";
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import CommentForm from "@/components/forms/comment-form";
import RepostForm from "@/components/forms/detail-repost-form";

async function getPost(postId: number) {
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
      _count: true,
    },
  });

  return post;
}

async function getIsReposted(postId: number, userId: number) {
  const reposted = await db.repost.findFirst({
    where: { userId, postId },
  });

  return Boolean(reposted);
}

async function getIsUserPost(postUserId: number) {
  const session = await getSession();
  return session?.id === postUserId;
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return notFound();
  }
  const post = await getPost(postId);
  if (!post) {
    return notFound();
  }
  const session = await getSession();
  if (!session?.id) {
    return notFound();
  }

  const isReposted = await getIsReposted(postId, session.id);
  const isUserPost = await getIsUserPost(post.userId);

  if (!post) {
    return notFound();
  }
  return (
    <>
      <section className="divide-y pb-16">
        {/* 본문 */}
        <div className="flex flex-col p-4 gap-2 shadow-md">
          <h5>{post.content}</h5>
          <p className="text-sm text-neutral-400">{post.tags}</p>
          <div className="flex justify-between pt-6 items-center">
            <div>
              <p className="text-xs text-neutral-400">
                {formatRelativeTime(new Date(post.created_at))}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <ArrowPathRoundedSquareIcon className="text-violet-600 dark:text-violet-400 size-5" />
                <p>{post._count.reposts}</p>
              </div>
              <div className="flex items-center gap-2">
                <ChatBubbleOvalLeftEllipsisIcon className="text-violet-600 dark:text-violet-400 size-5" />
                <p>{post._count.comments}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* 나도 */}
          <div className="flex gap-4 px-4 h-16 items-center border-b">
            {!isUserPost ? (
              <RepostForm
                postId={postId}
                isReposted={isReposted}
                repostCount={post._count.reposts}
              />
            ) : (
              <div className="flex items-center gap-1 border dark:border-neutral-800 shadow-sm rounded-md px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed">
                <ArrowPathRoundedSquareIcon className="size-4" />
                <span>나도</span>
                <span>{post._count.reposts}</span>
              </div>
            )}
            <p className="text-sm text-neutral-400">이 글에 공감한다면 나도!</p>
          </div>
          <div className="flex flex-col divide-y">
            {/* 댓글 */}
            {post.comments.map((comment) => (
              <Comment
                key={comment.id}
                commentId={comment.id}
                postId={postId}
                content={comment.content}
                username={comment.user.username}
                accountId={comment.user.login_id}
                avatar={comment.user.avatar}
                isUserComment={comment.user.id === session?.id}
              />
            ))}
          </div>
        </div>
      </section>
      <CommentForm postId={postId} />
    </>
  );
}
