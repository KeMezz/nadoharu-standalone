"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import ProfileImage from "../domains/profile/image";

interface HeaderProps {
  title?: string;
  canGoBack?: boolean;
  profile?: {
    id: number;
    username: string;
    avatar: string | null;
    loginId: string;
  } | null;
  children?: React.ReactNode;
}

export default function Header({
  title,
  canGoBack,
  profile,
  children,
}: HeaderProps) {
  const router = useRouter();
  return (
    <header className="px-4 h-14 border-b-2 border-violet-600 dark:border-violet-400 text-center fixed flex justify-between top-0 max-w-2xl w-full bg-white dark:bg-neutral-800 z-20 shadow-md">
      <section className="flex items-center gap-4">
        {canGoBack ? (
          <button>
            <ChevronLeftIcon onClick={router.back} className="size-6" />
          </button>
        ) : null}
        {title ? (
          <h1 className="text-lg font-bold text-violet-600 dark:text-violet-400">
            {title}
          </h1>
        ) : null}
        {profile ? (
          <Link
            href={`/users/${profile.loginId}`}
            className="flex items-center gap-3"
          >
            <ProfileImage avatar={profile.avatar} username={profile.username} />
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-sm">{profile.username}</h3>
              <p className="text-gray-400 text-xs">@{profile.loginId}</p>
            </div>
          </Link>
        ) : null}
      </section>
      <section className="flex items-center gap-5">{children}</section>
    </header>
  );
}
