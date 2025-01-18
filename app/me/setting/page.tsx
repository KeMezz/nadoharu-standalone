import EditProfileForm from "@/components/forms/edit-profile-form";
import db from "@/libs/db";
import getSession from "@/libs/session";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { notFound, redirect } from "next/navigation";

async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
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

export default async function EditProfile() {
  async function logout() {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/login");
  }

  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  const user = await getUser(session.id!);
  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col">
      <EditProfileForm
        username={user.username}
        avatar={user.avatar}
        login_id={user.login_id}
        bio={user.bio}
      />
      <form action={logout} className="p-4">
        <button className="flex items-center justify-center gap-2 border-2 border-violet-400 dark:border-violet-600 focus:ring-violet-600 text-white w-full py-2 rounded-md outline-none focus:ring-2">
          다른 계정으로 로그인
          <ArrowLeftStartOnRectangleIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}
