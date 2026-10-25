"use server";

import db from "@/libs/db";
import getSession from "@/libs/session";
import * as constants from "@/libs/constants";
import { ActionPrevState } from "@/types/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isCloudflareImageUrl, IMAGE_URL_MAX_LENGTH } from "@/libs/image-validation";

export interface UpdateProfileForm {
  avatar: string | null;
  bio: string | null;
}

const updateProfileSchema = z.object({
  avatar: z.string().max(IMAGE_URL_MAX_LENGTH)
    .refine((value) => value === "" || isCloudflareImageUrl(value), "올바른 사진 주소를 입력해주세요")
    .optional(),
  bio: z
    .string()
    .max(constants.BIO_MAX_LENGTH, constants.BIO_MAX_ERROR_MESSAGE)
    .optional(),
});

export async function updateProfile(
  _: ActionPrevState<UpdateProfileForm>,
  formData: FormData
) {
  const session = await getSession();
  if (!session.id) redirect("/login");

  const data = {
    avatar: formData.get("avatar") ?? undefined,
    bio: formData.get("bio") ?? undefined,
  };
  const result = await updateProfileSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    if (result.data.avatar) {
      await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          avatar: result.data.avatar,
          bio: result.data.bio,
        },
      });
    } else {
      await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          bio: result.data.bio,
        },
      });
    }

    revalidatePath("/me");
    redirect("/me");
  }
}
