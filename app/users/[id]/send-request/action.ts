"use server";

import db from "@/libs/db";
import getSession from "@/libs/session";
import { ActionPrevState } from "@/types/form";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

export interface SendFriendRequestForm {
  text: string;
}

const friendRequestSchema = z.object({
  text: z.string().max(1000, "내용은 1000자 이하로 입력해주세요"),
});

export async function sendFriendRequest(
  _: ActionPrevState<SendFriendRequestForm>,
  formData: FormData,
  recipientLoginId: string
) {
  try {
    const data = {
      text: formData.get("text"),
    };
    const result = await friendRequestSchema.spa(data);
    if (!result.success) {
      return result.error.flatten();
    }

    const recipient = await db.user.findUnique({
      where: {
        login_id: recipientLoginId,
      },
      select: {
        id: true,
      },
    });
    if (!recipient) {
      return notFound();
    }

    const session = await getSession();
    const isFriend = await db.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: session.id, recipientId: recipient.id },
          { initiatorId: recipient.id, recipientId: session.id },
        ],
        status: { in: [1, 2] },
      },
    });
    if (isFriend) {
      return redirect(`/users/${recipient.id}`);
    }

    if (session.id) {
      await db.friendship.create({
        data: {
          text: result.data.text,
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

    revalidatePath(`/users/${recipientLoginId}/friends`);
    redirect(`/users/${recipientLoginId}`);
  } catch (error) {
    console.error(error);
  }
}
