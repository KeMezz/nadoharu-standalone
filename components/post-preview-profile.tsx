"use client";

import Image from "next/image";
import Link from "next/link";

interface PostPreviewProfileProps {
  avatar: string | null;
  username: string;
  loginId: string;
}

export default function PostPreviewProfile({
  avatar,
  username,
  loginId,
}: PostPreviewProfileProps) {
  return (
    <Link
      prefetch={false}
      href={`/users/${loginId}`}
      className="flex items-center gap-3"
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={username}
          width={40}
          height={40}
          className="size-10 rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm"
        />
      ) : (
        <div className="size-10 bg-neutral-200 dark:bg-neutral-600 rounded-md shadow-sm" />
      )}
      <div className="flex flex-col">
        <h2 className="font-semibold text-sm">{username}</h2>
      </div>
    </Link>
  );
}
