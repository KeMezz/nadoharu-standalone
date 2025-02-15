"use client";

import { acceptRequest, deleteRequest } from "@/app/me/requested/action";
import { alertAtom, toastAtom } from "@/libs/atoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

interface ReceiveRequestFormProps {
  id: number;
  initiatorId: number;
  recipientId: number;
  status: number;
  text: string | null;
  createdAt: Date;
  updatedAt: Date;
  initiator: {
    id: number;
    username: string;
    avatar: string | null;
    loginId: string;
  };
}

export default function ReceiveRequestForm({
  initiator,
}: ReceiveRequestFormProps) {
  const router = useRouter();
  const setToast = useSetAtom(toastAtom);
  const setAlert = useSetAtom(alertAtom);

  const goToMePage = () => {
    router.push(`/me`);
  };

  // 모달의 삭제 버튼을 눌렀을 때
  const onDeleteClick = async () => {
    const result = await deleteRequest(initiator.id);
    if (result.success) {
      setToast({
        visible: true,
        title: "친구 신청을 삭제했습니다",
      });
      goToMePage();
    } else {
      setToast({
        visible: true,
        title: result.message,
      });
    }
  };

  // 모달의 친구하기 버튼을 눌렀을 때
  const onAcceptClick = async () => {
    const result = await acceptRequest(initiator.id);
    if (result.success) {
      setToast({
        visible: true,
        title: "친구 신청을 수락했습니다",
      });
      goToMePage();
    } else {
      setToast({
        visible: true,
        title: result.message,
      });
    }
  };

  // 삭제 모달 표시
  const showDeleteAlert = async () => {
    setAlert({
      visible: true,
      title: "삭제",
      description: `${initiator.username}님의 친구 신청을 삭제할까요?`,
      extraBtnColor: "red",
      extraBtnText: "삭제하기",
      extraBtnAction: onDeleteClick,
    });
  };

  // 친구하기 모달 표시
  const showAcceptAlert = async () => {
    setAlert({
      visible: true,
      title: "친구 신청",
      description: `${initiator.username}님의 친구 신청을 수락할까요?`,
      extraBtnColor: "green",
      extraBtnText: "수락하기",
      extraBtnAction: onAcceptClick,
    });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={showDeleteAlert}
        className="w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-400 p-2 text-sm"
      >
        삭제
      </button>
      <button
        onClick={showAcceptAlert}
        className="w-1/2 rounded-md bg-violet-500 dark:bg-violet-600 p-2 text-white hover:bg-violet-700 text-sm"
      >
        친구하기
      </button>
    </div>
  );
}
