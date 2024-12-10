import Header from "@/components/layouts/header";
import db from "@/libs/db";
import { notFound } from "next/navigation";
import getSession from "@/libs/session";
import PostDetailMoreBtns from "@/components/layouts/post-detail-more-buttons";

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

async function getIsUserPost(postId: number) {
  const session = await getSession();
  if (!session.id) {
    return false;
  }

  const postUser = await getPostUser(postId);
  return session.id === postUser?.id;
}

async function getPostUser(postId: number) {
  const user = await db.user.findFirst({
    where: {
      posts: {
        some: {
          id: postId,
        },
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      login_id: true,
    },
  });

  return user;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return notFound();
  }
  const postUser = await getPostUser(postId);
  const isUserPost = await getIsUserPost(postId);

  return (
    <main className="max-w-2xl mx-auto">
      <Header profile={postUser}>
        <PostDetailMoreBtns isUserPost={isUserPost} postId={postId} />
      </Header>
      <section className="mt-14 mb-20">{children}</section>
    </main>
  );
}
