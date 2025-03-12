"use client";

import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/16/solid";
import MoreButtons, { MoreBtn } from "@/components/shared/buttons/more-buttons";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/posts/[id]/action";
import { useSetAtom } from "jotai";
import { alertAtom, toastAtom } from "@/libs/atoms";

export default function PostDetailMoreBtns({
  isUserPost,
  postId,
}: {
  isUserPost: boolean;
  postId: number;
}) {
  const router = useRouter();
  const setAlert = useSetAtom(alertAtom);
  const setToast = useSetAtom(toastAtom);

  const removePost = async () => {
    const result = await deletePost(postId);
    if (result.success) {
      router.push("/posts");
      setToast({
        visible: true,
        title: "게시글이 삭제되었습니다.",
      });
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
