"use server";

import { ActionPrevState } from "@/types/form";
import { z } from "zod";
import * as constants from "@/libs/constants";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { revalidatePath } from "next/cache";
import { CommentForm } from "@/components/forms/comment-form";

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
  prevState: void | null,
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
    return { error: "You cannot repost your own post" };
  }
  if (!session.id) {
    return { error: "You must be logged in to repost" };
  }

  await db.repost.create({
    data: {
      userId: session.id,
      postId,
    },
  });

  revalidatePath(`/posts/${postId}`);
}
