"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface UserTemplateProps {
  isMe?: boolean;
  isFriend?: boolean;
  profile: {
    id: number;
    username: string;
    login_id: string;
    bio: string | null;
    avatar: string | null;
  };
}

export default function UserInfo({
  isMe = false,
  isFriend = false,
  profile,
}: UserTemplateProps) {
  const router = useRouter();
  const goToSettingPage = () => {
    router.push(`/me/edit`);
  };
  const onSettingsClick = () => {
    goToSettingPage();
  };

  return (
    <section>
      <div className="h-56 bg-neutral-100 dark:bg-neutral-800 flex flex-col justify-end p-4 gap-3 relative">
        <div className="flex flex-col gap-3">
          <div className="absolute right-4 top-4 flex gap-2">
            {isMe ? (
              <>
                <Link
                  href="/me/friends"
                  className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1"
                >
                  <UsersIcon className="size-4" />
                  친구 (0)
                </Link>
                <button
                  onClick={onSettingsClick}
                  className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1"
                >
                  <Cog6ToothIcon className="size-4" />
                  설정
                </button>
              </>
            ) : null}
            {isMe || isFriend ? null : (
              <Link
                href={`/users/{account_id}/create`}
                className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1"
              >
                <UserPlusIcon className="size-4" />
                친구 신청
              </Link>
            )}
          </div>
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              alt="avatar"
              width={48}
              height={48}
              className="size-12 rounded-md object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-neutral-300 dark:bg-neutral-500 rounded-md" />
          )}
          <div className="flex flex-col">
            <h5 className="font-semibold">{profile?.username}</h5>
            <p className="text-gray-400 text-sm">@{profile?.login_id}</p>
          </div>
        </div>
        {profile?.bio ? (
          <p className="text-xs text-slate-600">{profile?.bio}</p>
        ) : null}
      </div>
    </section>
  );
}
