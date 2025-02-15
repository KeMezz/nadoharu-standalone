"use client";

import Link from "next/link";
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import ProfileImage from "../profile-image";

interface UserTemplateProps {
  isMe?: boolean;
  isFriend?: boolean;
  isPending?: boolean;
  isPended?: boolean;
  pendedCount?: number;
  profile: {
    id: number;
    username: string;
    loginId: string;
    bio: string | null;
    avatar: string | null;
  };
  friendsCount: number;
}

export default function UserInfo({
  isMe,
  isFriend,
  isPending,
  isPended,
  pendedCount,
  profile,
  friendsCount,
}: UserTemplateProps) {
  return (
    <section>
      <div className="bg-neutral-100 dark:bg-neutral-800 flex flex-col justify-end p-4 gap-3 relative">
        <div className="flex flex-col gap-3 mt-20">
          <div className="absolute right-4 top-4 flex gap-2">
            <Link
              href={`/users/${profile.loginId}/friends`}
              className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1 relative"
            >
              {pendedCount ? (
                <div className="flex items-center justify-center size-4 bg-red-600 rounded-full absolute -top-2 -right-2">
                  <span className="text-xs text-white">{pendedCount}</span>
                </div>
              ) : null}
              <UsersIcon className="size-4" />
              친구 목록 ({friendsCount})
            </Link>
            {isMe ? (
              <Link
                href="/me/setting"
                className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1"
              >
                <Cog6ToothIcon className="size-4" />
                설정
              </Link>
            ) : null}
            {!isMe && !isFriend && !isPending && !isPended ? (
              <Link
                href={`/users/${profile.loginId}/send-request`}
                className="border border-violet-400 dark:border-white bg-white dark:bg-neutral-800 px-2 py-1 text-sm rounded-md text-violet-400 dark:text-white flex items-center gap-1"
              >
                <UserPlusIcon className="size-4" />
                친구 신청
              </Link>
            ) : null}
          </div>
          <ProfileImage
            avatar={profile.avatar}
            username={profile.username}
            size={20}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h5 className="font-semibold">{profile?.username}</h5>
              {isFriend ? (
                <span className="text-xs font-bold bg-violet-600 px-2 py-1 rounded-md text-neutral-200">
                  친구
                </span>
              ) : null}
              {isPending ? (
                <span className="text-xs font-bold bg-neutral-200 dark:bg-neutral-600 px-2 py-1 rounded-md text-neutral-600 dark:text-neutral-200">
                  친구 요청 보냄
                </span>
              ) : null}
              {isMe ? (
                <span className="text-xs font-bold bg-neutral-200 dark:bg-neutral-600 px-2 py-1 rounded-md text-neutral-600 dark:text-neutral-200">
                  내 프로필
                </span>
              ) : null}
              {isPended ? (
                <span className="text-xs font-bold bg-neutral-200 dark:bg-neutral-600 px-2 py-1 rounded-md text-neutral-600 dark:text-neutral-200">
                  친구 요청 받음
                </span>
              ) : null}
            </div>
            <p className="text-gray-400 text-sm">@{profile?.loginId}</p>
          </div>
        </div>
        {profile?.bio ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {profile?.bio}
          </p>
        ) : null}
      </div>
    </section>
  );
}
