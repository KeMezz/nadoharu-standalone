import Header from "@/components/layouts/header";
import db from "@/libs/db";
import { notFound } from "next/navigation";

async function getUser(userLoginId: string) {
  const user = await db.user.findUnique({
    where: { loginId: userLoginId },
    select: {
      id: true,
      username: true,
      avatar: true,
      loginId: true,
    },
  });

  return user;
}

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: loginId } = await params;
  const user = await getUser(loginId);
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
