import { notFound } from "next/navigation";
import db from "@/libs/db";
import getSession from "@/libs/session";
import UserTimeline from "@/components/user-timeline";
import UserInfo from "@/components/layouts/user-info";

export const metadata = {
  title: "나는",
};

async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      login_id: true,
      avatar: true,
      bio: true,
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

async function getPosts(userId: number) {
  const posts = await db.post.findMany({
    where: {
      userId,
      is_deleted: false,
    },
    include: {
      user: true,
      reposts: true,
      _count: true,
    },
  });

  return posts;
}

async function getReposts(userId: number) {
  const reposts = await db.repost.findMany({
    where: {
      userId,
      post: {
        is_deleted: false,
      },
    },
    distinct: ["postId"],
    orderBy: {
      post: {
        created_at: "asc",
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          login_id: true,
          avatar: true,
        },
      },
      post: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              login_id: true,
              avatar: true,
            },
          },
          reposts: {
            where: {
              userId,
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

async function getPendedCount(sessionId: number) {
  const pendedCount = await db.friendship.count({
    where: {
      recipientId: sessionId,
      status: 2,
    },
  });

  return pendedCount;
}

export default async function Me() {
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  const user = await getUser(session.id);
  if (!user) {
    return notFound();
  }
  const posts = await getPosts(session.id);
  const reposts = await getReposts(session.id);
  const friendsCount = await getFriendsCount(session.id);
  const pendedCount = await getPendedCount(session.id);
  return (
    <>
      <UserInfo
        isMe={true}
        profile={user}
        friendsCount={friendsCount}
        pendedCount={pendedCount}
      />
      <UserTimeline posts={posts} reposts={reposts} userId={session.id!} />
    </>
  );
}
