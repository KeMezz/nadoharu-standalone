import UserInfo from "@/components/layouts/user-info";
import UserTimeline from "@/components/user-timeline";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { notFound } from "next/navigation";

async function getUser(userLoginId: string) {
  const user = await db.user.findUnique({
    where: { login_id: userLoginId },
    select: {
      id: true,
      username: true,
      login_id: true,
      bio: true,
      avatar: true,
    },
  });

  return user;
}

async function getPosts(userLoginId: string) {
  const posts = await db.post.findMany({
    where: {
      user: {
        login_id: userLoginId,
      },
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

async function getReposts(userLoginId: string) {
  const reposts = await db.repost.findMany({
    where: {
      user: {
        login_id: userLoginId,
      },
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
              user: {
                login_id: userLoginId,
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
    },
  });

  return Boolean(isFriend);
}

export default async function Users({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) {
    return notFound();
  }

  const session = await getSession();
  const isMe = user.id === session?.id;
  const isFriend = await getIsFriend(user.id, session.id!);

  const posts = await getPosts(id);
  const reposts = await getReposts(id);

  return (
    <>
      <UserInfo isMe={isMe} profile={user} isFriend={isFriend} />
      <UserTimeline posts={posts} reposts={reposts} userId={user.id} />
    </>
  );
}
