"use server";

import db from "@/libs/db";
import getSession from "@/libs/session";
import Image from "next/image";
import ReceiveRequestForm from "@/components/forms/receive-request-form";
import Link from "next/link";
import ProfileImage from "@/components/profile-image";

async function getFriendRequests(userId: number) {
  const requests = await db.friendship.findMany({
    where: {
      recipientId: userId,
      status: 2,
    },
    include: {
      initiator: {
        select: {
          id: true,
          username: true,
          avatar: true,
          login_id: true,
        },
      },
    },
  });

  return requests;
}

export default async function Requested() {
  const session = await getSession();
  const requests = await getFriendRequests(session.id!);

  return (
    <section className="flex flex-col gap-4 p-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 shadow-md rounded-md"
        >
          <Link
            href={`/users/${request.initiator.login_id}`}
            className="flex items-center gap-4"
          >
            <ProfileImage
              avatar={request.initiator.avatar}
              username={request.initiator.username}
            />
            <div className="flex flex-col">
              <span className="font-medium">{request.initiator.username}</span>
              <span className="text-xs text-neutral-500">
                @{request.initiator.login_id}
              </span>
            </div>
          </Link>
          {request.text === "" ? (
            <p className="text-sm text-neutral-500">
              친구 신청 메시지가 없습니다
            </p>
          ) : (
            <p className="text-sm">{request.text}</p>
          )}
          <ReceiveRequestForm {...request} />
        </div>
      ))}
    </section>
  );
}
