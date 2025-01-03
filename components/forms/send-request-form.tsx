"use client";

import {
  sendFriendRequest,
  SendFriendRequestForm,
} from "@/app/users/[id]/send-request/action";
import SubmitButton from "../buttons/submit-button";
import Textarea from "../inputs/textarea";
import { useActionState } from "react";
import { ActionPrevState } from "@/types/form";

interface SendRequestFormProps {
  username: string;
  loginId: string;
}

export default function SendRequestForm({
  username,
  loginId,
}: SendRequestFormProps) {
  const [state, action] = useActionState(
    (_: ActionPrevState<SendFriendRequestForm>, formData: FormData) =>
      sendFriendRequest(_, formData, loginId),
    null
  );
  return (
    <form action={action} className="flex flex-col gap-4 p-4">
      <Textarea
        name="text"
        placeholder={`${username}님, 저랑 친구해요!`}
        errors={state?.fieldErrors.text}
      />
      <SubmitButton text="친구 신청 보내기" />
    </form>
  );
}
