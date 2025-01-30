"use client";

import ChatInput from "../inputs/chat-input";
import { useActionState } from "react";
import { createComment } from "@/app/posts/[id]/action";
import { ActionPrevState } from "@/types/form";

export interface CommentForm {
  postId: string;
  content: string;
}

export default function CommentForm({ postId }: { postId: number }) {
  const [state, action, pending] = useActionState(
    async (state: ActionPrevState<CommentForm>, formData: FormData) =>
      createComment(state, formData, postId),
    null
  );
  return (
    <form action={action}>
      <ChatInput
        name="content"
        placeholder={pending ? "댓글을 업로드하는 중.." : "댓글 입력.."}
        pending={pending}
        errors={state?.fieldErrors?.content}
      />
    </form>
  );
}
