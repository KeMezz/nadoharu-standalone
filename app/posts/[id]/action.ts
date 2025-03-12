"use server";

import { ActionPrevState } from "@/types/form";
import { z } from "zod";
import * as constants from "@/libs/constants";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { revalidatePath } from "next/cache";
import { CommentForm } from "@/components/domains/comment/form";

const commentSchema = z.object({
  content: z
    .string()
    .max(
      constants.COMMENT_CONTENT_MAX_LENGTH,
      constants.COMMENT_CONTENT_MAX_ERROR_MESSAGE
    ),
});

export async function createComment(
  _: ActionPrevState<CommentForm>,
  formData: FormData,
  postId: number
) {
  const data = {
    content: formData.get("content"),
  };
  const result = await commentSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const comment = await db.comment.create({
      select: {
        id: true,
      },
      data: {
        content: result.data.content,
        user: {
          connect: {
            id: session.id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
    revalidatePath(`/posts/${postId}`);

    // 게시글 작성자 정보 취득
    const recipient = await db.user.findFirst({
      select: {
        id: true,
      },
      where: {
        posts: {
          some: {
            id: postId,
          },
        },
      },
    });

    // 게시글 작성자에게 알림 전송
    if (!recipient?.id || !comment.id) return;
    if (session.id === recipient?.id) return;
    await db.notifications.create({
      data: {
        type: "COMMENT",
        message: result.data.content,
        actionUrl: `/posts/${postId}`,
        comment: {
          connect: {
            id: comment.id,
          },
        },
        initiator: {
          connect: {
            id: session.id,
          },
        },
        recipient: {
          connect: {
            id: recipient.id,
          },
        },
      },
    });
  }
}

export async function repost(postId: number) {
  try {
    const session = await getSession();
    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
        content: true,
      },
    });

    if (!post) return;
    if (post.userId === session.id) {
      throw new Error("자신의 게시물에는 공감할 수 없어요");
    }
    if (!session.id) {
      throw new Error("로그인 정보를 찾을 수 없어요");
    }

    const alreadyReposted = await db.repost.findFirst({
      select: { id: true },
      where: { userId: session.id, postId },
    });
    if (alreadyReposted) {
      return { success: false };
    }

    const repost = await db.repost.create({
      select: {
        id: true,
      },
      data: {
        userId: session.id,
        postId,
      },
    });

    const previousNotification = await db.notifications.findFirst({
      where: {
        repostId: repost.id,
      },
    });
    if (!previousNotification) {
      const user = await db.user.findUnique({
        select: {
          username: true,
        },
        where: { id: session.id },
      });
      await db.notifications.create({
        data: {
          type: "REPOST",
          message: `${user?.username}님이 '${post.content}'에 공감했어요.`,
          actionUrl: `/posts/${postId}`,
          repost: {
            connect: {
              id: repost.id,
            },
          },
          recipient: {
            connect: {
              id: post.userId,
            },
          },
          initiator: {
            connect: {
              id: session.id,
            },
          },
        },
      });
    }

    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "'나도!'를 처리하는 도중에 오류가 발생했어요.",
    };
  }
}

export async function unrepost(postId: number) {
  try {
    const session = await getSession();
    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (post?.userId === session.id) {
      throw new Error("자신의 게시물에는 공감할 수 없어요");
    }
    if (!session.id) {
      throw new Error("로그인 정보를 찾을 수 없어요");
    }

    const reposted = await db.repost.findFirst({
      where: { userId: session.id, postId },
    });

    if (!reposted) {
      return { success: false };
    }

    await db.repost.delete({
      where: { userId_postId: { userId: session.id, postId } },
    });

    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "'나도!'를 취소하는 도중에 오류가 발생했어요.",
    };
  }
}

export async function deletePost(postId: number) {
  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        isDeleted: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "게시물 삭제하는 도중에 오류가 발생했어요.",
    };
  }
}

export async function deleteComment(commentId: number, postId: number) {
  try {
    await db.comment.delete({
      where: { id: commentId },
    });
    revalidatePath(`/posts/${postId}`);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "댓글 삭제하는 도중에 오류가 발생했어요.",
    };
  }
}
