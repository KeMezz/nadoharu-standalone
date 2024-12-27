"use server";

import db from "@/libs/db";
import getSession from "@/libs/session";
import Image from "next/image";

async function getFriendRequests(userId: number) {
  const requests = await db.friendship.findMany({
    where: {
      recipientId: userId,
      // status: 2,
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
          className="flex flex-col gap-4 p-4 bg-neutral-800 shadow-md rounded-md"
        >
          <div className="flex items-center gap-4">
            {request.initiator.avatar ? (
              <Image
                src={request.initiator.avatar}
                alt={request.initiator.username}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-300" />
            )}
            <div className="flex flex-col">
              <span className="font-medium">{request.initiator.username}</span>
              <span className="text-xs text-neutral-500">
                @{request.initiator.login_id}
              </span>
            </div>
          </div>
          <div>{request.text ?? "우리 친구해요!"}</div>
          <div className="flex items-center gap-2">
            <button className="w-1/2 rounded-md bg-neutral-600 hover:bg-neutral-400 p-2">
              삭제
            </button>
            <button className="w-1/2 rounded-md bg-violet-600 p-2 text-white hover:bg-violet-700">
              친구하기
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}