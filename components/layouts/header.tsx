"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  profile?: {
    id: number;
    username: string;
    avatar: string | null;
    login_id: string;
  } | null;
  children?: React.ReactNode;
}

export default function Header({ title, profile, children }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="px-4 h-14 border-b-2 border-violet-600 dark:border-violet-400 text-center fixed flex justify-between top-0 max-w-2xl w-full bg-white dark:bg-neutral-800 z-20 shadow-md">
      <section className="flex items-center gap-4">
        {title ? (
          <h1 className="text-lg font-bold text-violet-600 dark:text-violet-400">
            {title}
          </h1>
        ) : (
          <button>
            <ChevronLeftIcon onClick={router.back} className="size-6" />
          </button>
        )}
        {profile ? (
          <Link
            href={`/users/${profile.login_id}`}
            className="flex items-center gap-3"
          >
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.username}
                width={40}
                height={40}
                className="size-10 rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-neutral-300 rounded-md" />
            )}
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-sm">{profile.username}</h3>
              <p className="text-gray-400 text-xs">@{profile.login_id}</p>
            </div>
          </Link>
        ) : null}
      </section>
      <section className="flex items-center gap-5">{children}</section>
    </header>
  );
}
