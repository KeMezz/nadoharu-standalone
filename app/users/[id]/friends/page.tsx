import db from "@/libs/db";
import getSession from "@/libs/session";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getIsMe(loginId: string) {
  const session = await getSession();
  const targetUser = await db.user.findUnique({
    where: {
      login_id: loginId,
    },
    select: {
      id: true,
    },
  });

  return targetUser?.id === session?.id;
}

async function getFriends(loginId: string) {
  const friends = await db.friendship.findMany({
    where: {
      OR: [
        { initiator: { login_id: loginId } },
        { recipient: { login_id: loginId } },
      ],
      status: 1,
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
      recipient: {
        select: {
          id: true,
          username: true,
          avatar: true,
          login_id: true,
        },
      },
    },
  });
  return friends;
}

async function getPendingFriendsCount(loginId: string) {
  const pendingFriendsCount = await db.friendship.count({
    where: {
      OR: [{ recipient: { login_id: loginId } }],
      status: 2,
    },
  });

  return pendingFriendsCount;
}

export default async function Friends({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: loginId } = await params;
  const friendships = await getFriends(loginId);
  const friends = friendships.map((friendship) =>
    friendship.initiator.login_id === loginId
      ? friendship.recipient
      : friendship.initiator
  );
  const isMe = await getIsMe(loginId);
  const pendingFriendsCount = await getPendingFriendsCount(loginId);

  return (
    <section className="flex flex-col p-4 gap-4">
      {isMe && pendingFriendsCount > 0 ? (
        <div className="flex items-center justify-between h-8">
          <span className="text-sm text-neutral-500">
            {pendingFriendsCount}명의 친구 요청이 도착했어요.
          </span>
          <Link
            href="/me/requested"
            className="text-violet-600 dark:text-white font-bold text-sm flex items-center gap-2"
          >
            <span>보러가기</span>
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        {friends.map((friend) => (
          <Link
            key={friend.id}
            href={`/users/${friend.login_id}`}
            className="flex items-center gap-4"
          >
            {friend.avatar ? (
              <Image
                src={friend.avatar}
                alt={friend.username}
                width={40}
                height={40}
                className="size-10 rounded-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-300" />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-sm">{friend.username}</span>
              <span className="text-xs text-neutral-500">
                @{friend.login_id}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
