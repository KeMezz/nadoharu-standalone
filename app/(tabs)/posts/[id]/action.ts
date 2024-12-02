"use server";

import { ActionPrevState } from "@/types/form";
import { z } from "zod";
import * as constants from "@/libs/constants";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { revalidatePath } from "next/cache";
import { CommentForm } from "@/components/forms/comment-form";
import { ResponseWithAlert } from "@/hooks/use-action-with-alert";

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
    await db.comment.create({
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
  }
}

export async function repost(
  prevState: void | ResponseWithAlert | null,
  formData: FormData,
  postId: number
) {
  const session = await getSession();
  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
    },
  });

  if (post?.userId === session.id) {
    return {
      success: false,
      alert: {
        visible: true,
        title: "잠깐!",
        description: "자신의 게시물에는 공감할 수 없어요.",
      },
    };
  }
  if (!session.id) {
    return {
      success: false,
      alert: {
        visible: true,
        title: "잠깐!",
        description: "먼저 로그인을 해주세요.",
      },
    };
  }

  const reposted = await db.repost.findFirst({
    where: { userId: session.id, postId },
  });

  if (reposted) {
    return { success: false };
  }

  await db.repost.create({
    data: {
      userId: session.id,
      postId,
    },
  });

  revalidatePath(`/posts/${postId}`);

  return { success: true };
}

export async function unrepost(
  prevState: void | ResponseWithAlert | null,
  formData: FormData,
  postId: number
) {
  const session = await getSession();
  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
    },
  });

  if (post?.userId === session.id) {
    return {
      success: false,
      alert: {
        visible: true,
        title: "잠깐!",
        description: "자신의 게시물에는 공감할 수 없어요.",
      },
    };
  }
  if (!session.id) {
    return {
      success: false,
      alert: {
        visible: true,
        title: "잠깐!",
        description: "먼저 로그인을 해주세요.",
      },
    };
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
}
