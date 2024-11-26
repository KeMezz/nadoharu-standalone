import Layout from "@/components/layouts/layout";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { FRIEND_ACCEPTED } from "@/libs/constants";
import { notFound } from "next/navigation";
import Timeline from "@/components/timeline";

async function getFriends(userId: number) {
  const friends = await db.friendship.findMany({
    where: {
      OR: [
        { initiatorId: userId, status: FRIEND_ACCEPTED },
        { recipientId: userId, status: FRIEND_ACCEPTED },
      ],
    },
    include: {
      initiator: true,
      recipient: true,
    },
  });

  return friends.map((friend) =>
    friend.initiatorId === userId ? friend.recipient : friend.initiator
  );
}

async function getFeeds(userId: number) {
  const friends = await getFriends(userId);
  const feedUserIds = [...friends.map((friend) => friend.id), userId];

  const posts = await db.post.findMany({
    where: {
      userId: {
        in: feedUserIds,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          login_id: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          comments: true,
          reposts: true,
        },
      },
    },
  });
  const reposts = await db.repost.findMany({
    where: {
      userId: {
        in: feedUserIds,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          login_id: true,
          avatar: true,
        },
      },
      post: {
        include: {
          user: {
            select: {
              username: true,
              login_id: true,
              avatar: true,
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

  return { posts, reposts };
}

export const metadata = {
  title: "모아보는",
};

export default async function Posts() {
  const session = await getSession();
  const userId = Number(session.id);
  if (isNaN(userId)) {
    return notFound();
  }

  const { posts, reposts } = await getFeeds(userId);

  return (
    <Layout title="모아보는" showNewPostBtn>
      <Timeline posts={posts} reposts={reposts} />
    </Layout>
  );
}
