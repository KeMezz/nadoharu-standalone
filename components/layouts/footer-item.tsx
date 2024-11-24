"use client";

import {
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  RectangleStackIcon as RectangleStackOutlineIcon,
  UserIcon as UserOutlineIcon,
  UsersIcon as UsersOutlineIcon,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightOutlineIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Link = "/home" | "/chat" | "/me" | "/friends";

interface FooterItemProps {
  title: string;
  link: Link;
}

const FooterItem = ({ title, link }: FooterItemProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={`${link}`}
      className="relative border-t-4 border-violet-800 text-white font-bold"
    >
      <div className="flex flex-col items-center gap-2 absolute bottom-5 left-0 right-0">
        {pathname.startsWith(link) ? icons[link].active : icons[link].inactive}
        <p className="text-xs">{title}</p>
      </div>
    </Link>
  );
};

const icons = {
  "/home": {
    active: <RectangleStackIcon className="size-5" />,
    inactive: <RectangleStackOutlineIcon className="size-5" />,
  },
  "/me": {
    active: <UserIcon className="size-5" />,
    inactive: <UserOutlineIcon className="size-5" />,
  },
  "/friends": {
    active: <UsersIcon className="size-5" />,
    inactive: <UsersOutlineIcon className="size-5" />,
  },
  "/chat": {
    active: <ChatBubbleLeftRightIcon className="size-5" />,
    inactive: <ChatBubbleLeftRightOutlineIcon className="size-5" />,
  },
};

export default FooterItem;