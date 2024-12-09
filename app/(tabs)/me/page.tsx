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

async function getPosts(userId: number) {
  const posts = await db.post.findMany({
    where: {
      userId,
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

  return (
    <>
      <UserInfo isMe={true} profile={user} />
      <UserTimeline posts={posts} reposts={reposts} userId={session.id!} />
    </>
  );
}
