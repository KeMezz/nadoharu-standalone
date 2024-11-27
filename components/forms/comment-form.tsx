"use client";

import ChatInput from "../chat-input";
import { useActionState } from "react";
import { createComment } from "@/app/(tabs)/posts/[id]/action";
import { ActionPrevState } from "@/types/form";

export interface CommentForm {
  postId: string;
  content: string;
}

export default function CommentForm({ postId }: { postId: number }) {
  const [state, action] = useActionState(
    async (state: ActionPrevState<CommentForm>, formData: FormData) =>
      createComment(state, formData, postId),
    null
  );
  return (
    <form action={action}>
      <ChatInput
        name="content"
        placeholder="댓글 입력.."
        errors={state?.fieldErrors?.content}
      />
    </form>
  );
}
