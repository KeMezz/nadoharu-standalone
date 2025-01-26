"use server";

import { z } from "zod";
import * as constants from "@/libs/constants";
import getSession from "@/libs/session";
import db from "@/libs/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionPrevState } from "@/types/form";

export interface UploadPostForm {
  content: string;
  tags: string;
  photos: string[];
}

const postSchema = z.object({
  content: z
    .string({ required_error: constants.POST_CONTENT_REQUIRED_ERROR_MESSAGE })
    .min(1, constants.POST_CONTENT_REQUIRED_ERROR_MESSAGE)
    .max(
      constants.POST_CONTENT_MAX_LENGTH,
      constants.POST_CONTENT_MAX_ERROR_MESSAGE
    ),
  tags: z
    .string()
    .max(constants.POST_TAGS_MAX_LENGTH, constants.POST_TAGS_MAX_ERROR_MESSAGE),
  photos: z.array(z.string()).max(4, constants.POST_PHOTOS_MAX_ERROR_MESSAGE),
});

export async function uploadPost(
  _: ActionPrevState<UploadPostForm>,
  formData: FormData
) {
  const data = {
    content: formData.get("content"),
    tags: formData.get("tags"),
    photos: JSON.parse(formData.get("photos") as string),
  };
  const result = await postSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  }
  const session = await getSession();
  if (session.id) {
    await db.post.create({
      data: {
        content: result.data.content,
        tags: result.data.tags,
        userId: session.id,
        photos: result.data.photos,
      },
      select: {
        id: true,
      },
    });
    revalidatePath("/posts");
    redirect("/posts");
  }
}
