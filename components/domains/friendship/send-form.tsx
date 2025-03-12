"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { toastAtom } from "@/libs/atoms";
import {
  sendFriendRequest,
  SendFriendRequestForm,
} from "@/app/users/[id]/send-request/action";
import SubmitButton from "@/components/shared/buttons/submit-button";
import Textarea from "@/components/shared/inputs/textarea";
import { ActionPrevState } from "@/types/form";

interface FriendshipSendFormProps {
  username: string;
  loginId: string;
}

export default function FriendshipSendForm({
  username,
  loginId,
}: FriendshipSendFormProps) {
  const router = useRouter();
  const setToast = useSetAtom(toastAtom);

  const handleSubmit = async (
    state: ActionPrevState<SendFriendRequestForm>,
    formData: FormData
  ) => {
    const result = await sendFriendRequest(state, formData, loginId);
    if (result?.success) {
      setToast({
        visible: true,
        title: result?.message,
      });

      router.push(`/users/${loginId}`);
    }

    return result;
  };
  const [state, action, pending] = useActionState(handleSubmit, null);

  return (
    <form action={action} className="flex flex-col gap-4 p-4">
      <Textarea
        name="text"
        placeholder={`${username}님, 저랑 친구해요!`}
        errors={state?.fieldErrors?.text}
      />
      <SubmitButton
        text="친구 신청 보내기"
        pending={pending}
        pendingText="친구 신청 보내는 중..."
      />
    </form>
  );
}
