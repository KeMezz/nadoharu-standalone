"use client";

import { acceptRequest, deleteRequest } from "@/app/me/requested/action";
import { alertAtom } from "@/libs/atoms";
import { useSetAtom } from "jotai";

interface ReceiveRequestFormProps {
  id: number;
  initiatorId: number;
  recipientId: number;
  status: number;
  text: string | null;
  created_at: Date;
  updated_at: Date;
  initiator: {
    id: number;
    username: string;
    avatar: string | null;
    login_id: string;
  };
}

export default function ReceiveRequestForm({
  initiator,
}: ReceiveRequestFormProps) {
  const setAlert = useSetAtom(alertAtom);
  const onDeleteClick = async () => {
    setAlert({
      visible: true,
      title: "삭제",
      description: `${initiator.username}님의 친구 신청을 삭제할까요?`,
      extraBtnColor: "red",
      extraBtnText: "삭제하기",
      extraBtnAction: () => deleteRequest(initiator.id),
    });
  };
  const onAcceptClick = async () => {
    setAlert({
      visible: true,
      title: "친구 신청",
      description: `${initiator.username}님의 친구 신청을 수락할까요?`,
      extraBtnColor: "green",
      extraBtnText: "수락하기",
      extraBtnAction: () => acceptRequest(initiator.id),
    });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={onDeleteClick}
        className="w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-400 p-2 text-sm"
      >
        삭제
      </button>
      <button
        onClick={onAcceptClick}
        className="w-1/2 rounded-md bg-violet-500 dark:bg-violet-600 p-2 text-white hover:bg-violet-700 text-sm"
      >
        친구하기
      </button>
    </div>
  );
}
