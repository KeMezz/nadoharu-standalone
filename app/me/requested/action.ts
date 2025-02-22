"use server";

import db from "@/libs/db";
import getSession from "@/libs/session";
import { revalidatePath } from "next/cache";

export async function deleteRequest(initiatorId: number) {
  try {
    const session = await getSession();
    const friendship = await db.friendship.update({
      select: {
        id: true,
      },
      where: {
        initiatorId_recipientId: {
          initiatorId: initiatorId,
          recipientId: session.id!,
        },
        status: 2,
      },
      data: {
        status: 0,
      },
    });

    await db.notifications.updateMany({
      where: {
        friendshipId: friendship.id,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/me/requested");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "친구 신청 삭제 실패",
    };
  }
}

export async function acceptRequest(initiatorId: number) {
  try {
    const session = await getSession();

    const friendship = await db.friendship.update({
      select: {
        id: true,
      },
      where: {
        initiatorId_recipientId: {
          initiatorId: initiatorId,
          recipientId: session.id!,
        },
        status: 2,
      },
      data: {
        status: 1,
      },
    });
    revalidatePath("/me/requested");

    await db.notifications.updateMany({
      where: {
        friendshipId: friendship.id,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "친구 신청 수락 실패",
    };
  }
}
