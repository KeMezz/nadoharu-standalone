import UserInfo from "@/components/layouts/user-info";
import UserTimeline from "@/components/domains/post/user-timeline";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { notFound } from "next/navigation";

async function getUser(userLoginId: string) {
  const user = await db.user.findUnique({
    where: { loginId: userLoginId },
    select: {
      id: true,
      username: true,
      loginId: true,
      bio: true,
      avatar: true,
    },
  });

  return user;
}

async function getFriendsCount(userId: number) {
  const friendsCount = await db.friendship.count({
    where: {
      OR: [{ initiatorId: userId }, { recipientId: userId }],
      status: 1,
    },
  });

  return friendsCount;
}

async function getPosts(userLoginId: string) {
  const posts = await db.post.findMany({
    where: {
      user: {
        loginId: userLoginId,
      },
      isDeleted: false,
    },
    include: {
      user: true,
      reposts: true,
      _count: true,
    },
  });

  return posts;
}

async function getReposts(userLoginId: string) {
  const reposts = await db.repost.findMany({
    where: {
      user: {
        loginId: userLoginId,
      },
      post: {
        isDeleted: false,
      },
    },
    distinct: ["postId"],
    orderBy: {
      post: {
        createdAt: "asc",
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          loginId: true,
          avatar: true,
        },
      },
      post: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              loginId: true,
              avatar: true,
            },
          },
          reposts: {
            where: {
              user: {
                loginId: userLoginId,
              },
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              comments: true,
              reposts: true,
            },
          },
        },
      },
    },
  });

  return reposts;
}

async function getIsFriend(userId: number, sessionId: number) {
  const isFriend = await db.friendship.findFirst({
    where: {
      OR: [
        {
          initiatorId: userId,
          recipientId: sessionId,
        },
        {
          initiatorId: sessionId,
          recipientId: userId,
        },
      ],
      status: 1,
    },
  });

  return Boolean(isFriend);
}

async function getIsPended(userId: number, sessionId: number) {
  const isFriend = await db.friendship.findFirst({
    where: {
      initiatorId: userId,
      recipientId: sessionId,
      status: 2,
    },
  });

  return Boolean(isFriend);
}

async function getIsPending(userId: number, sessionId: number) {
  const isFriend = await db.friendship.findFirst({
    where: {
      initiatorId: sessionId,
      recipientId: userId,
      status: 2,
    },
  });

  return Boolean(isFriend);
}

export default async function Users({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: loginId } = await params;
  const user = await getUser(loginId);
  if (!user) {
    return notFound();
  }

  const session = await getSession();
  const isMe = user.id === session?.id;
  const isFriend = await getIsFriend(user.id, session.id!);
  const isPending = await getIsPending(user.id, session.id!);
  const isPended = await getIsPended(user.id, session.id!);
  const friendsCount = await getFriendsCount(user.id);

  const posts = await getPosts(loginId);
  const reposts = await getReposts(loginId);

  return (
    <>
      <UserInfo
        isMe={isMe}
        profile={user}
        isFriend={isFriend}
        isPending={isPending}
        isPended={isPended}
        friendsCount={friendsCount}
      />
      <UserTimeline posts={posts} reposts={reposts} userId={user.id} />
    </>
  );
}
