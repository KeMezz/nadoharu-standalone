"use client";

import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/16/solid";
import MoreButtons, { MoreBtn } from "./more-buttons";

export default function PostDetailMoreBtns({
  isUserPost,
}: {
  isUserPost: boolean;
}) {
  const buttons: MoreBtn[] = [
    isUserPost
      ? {
          name: "삭제하기",
          icon: <TrashIcon className="size-5" />,
          action: () => console.log("삭제하기"),
        }
      : {
          name: "신고하기",
          icon: <ExclamationTriangleIcon className="size-5" />,
          action: () => console.log("신고하기"),
        },
  ];
  return <MoreButtons buttons={buttons} />;
}
