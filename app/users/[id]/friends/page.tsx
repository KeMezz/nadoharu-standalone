import db from "@/libs/db";
import Image from "next/image";

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
  return (
    <section className="flex flex-col gap-4 p-4">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center gap-4">
          {friend.avatar ? (
            <Image
              src={friend.avatar}
              alt={friend.username}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-neutral-300" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">{friend.username}</span>
            <span className="text-xs text-neutral-500">@{friend.login_id}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
