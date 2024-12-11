"use client";

import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/16/solid";
import MoreButtons, { MoreBtn } from "./more-buttons";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/posts/[id]/action";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/libs/atoms";

export default function PostDetailMoreBtns({
  isUserPost,
  postId,
}: {
  isUserPost: boolean;
  postId: number;
}) {
  const router = useRouter();
  const setAlert = useSetAtom(alertAtom);
  const removePost = async () => {
    const res = await deletePost(postId);
    if (res.success) {
      router.push("/posts");
    }
  };
  const showRemoveAlert = () => {
    setAlert({
      visible: true,
      title: "삭제",
      description: "정말로 게시글을 삭제할까요?",
      extraBtnColor: "red",
      extraBtnText: "삭제하기",
      extraBtnAction: removePost,
    });
  };

  const buttons: MoreBtn[] = [
    isUserPost
      ? {
          name: "삭제하기",
          icon: <TrashIcon className="size-5" />,
          action: showRemoveAlert,
        }
      : {
          name: "신고하기",
          icon: <ExclamationTriangleIcon className="size-5" />,
          action: () => console.log("신고하기"),
        },
  ];

  return <MoreButtons buttons={buttons} />;
}
