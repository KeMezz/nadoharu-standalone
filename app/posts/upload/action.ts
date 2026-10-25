"use server";

import { z } from "zod";
import { parsePostPhotos, isCloudflareImageUrl, IMAGE_URL_MAX_LENGTH } from "@/libs/image-validation";
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
  photos: z.array(z.string().max(IMAGE_URL_MAX_LENGTH).refine(isCloudflareImageUrl))
    .max(constants.POST_PHOTOS_MAX_LENGTH, constants.POST_PHOTOS_MAX_ERROR_MESSAGE),
});

export async function uploadPost(
  _: ActionPrevState<UploadPostForm>,
  formData: FormData
) {
  const session = await getSession();
  if (!session.id) redirect("/login");

  const photos = parsePostPhotos(formData.get("photos"));
  if (photos === null) {
    return { formErrors: [], fieldErrors: { photos: ["올바른 사진 주소를 최대 4개 입력해주세요"] } };
  }
  const data = {
    content: formData.get("content"),
    tags: formData.get("tags"),
    photos,
  };
  const result = await postSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  }
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
