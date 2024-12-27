import Header from "@/components/layouts/header";
import db from "@/libs/db";
import { notFound } from "next/navigation";

async function getUser(userLoginId: string) {
  const user = await db.user.findUnique({
    where: { login_id: userLoginId },
    select: {
      id: true,
      username: true,
      avatar: true,
      login_id: true,
    },
  });

  return user;
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) {
    return notFound();
  }

  return (
    <main className="max-w-2xl mx-auto">
      <Header profile={user} canGoBack />
      <section className={"mt-14 mb-20"}>{children}</section>
    </main>
  );
}
