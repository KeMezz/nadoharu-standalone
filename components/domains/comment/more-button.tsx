"use client";

import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/16/solid";
import MoreButtons, { MoreBtn } from "@/components/shared/buttons/more-buttons";
import { useSetAtom } from "jotai";
import { alertAtom, toastAtom } from "@/libs/atoms";
import { deleteComment } from "@/app/posts/[id]/action";

export default function CommentMoreBtns({
  isUserComment,
  commentId,
  postId,
}: {
  isUserComment: boolean;
  commentId: number;
  postId: number;
}) {
  const setAlert = useSetAtom(alertAtom);
  const setToast = useSetAtom(toastAtom);
  const removeComment = async () => {
    await deleteComment(commentId, postId);
    setToast({
      visible: true,
      title: "댓글이 삭제되었습니다.",
    });
  };
  const showRemoveAlert = () => {
    setAlert({
      visible: true,
      title: "삭제",
      description: "정말로 댓글을 삭제할까요?",
      extraBtnColor: "red",
      extraBtnText: "삭제하기",
      extraBtnAction: removeComment,
    });
  };

  const buttons: MoreBtn[] = [
    isUserComment
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
