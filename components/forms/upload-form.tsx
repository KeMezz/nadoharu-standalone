"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import SubmitButton from "../buttons/submit-button";
import TextInput from "../inputs/text-input";
import Textarea from "../inputs/textarea";
import { useActionState } from "react";
import { uploadPost } from "@/app/(tabs)/posts/upload/action";

export default function UploadForm() {
  const [state, action] = useActionState(uploadPost, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <Textarea
        placeholder="무슨 일이 일어나고 있나요?"
        name="content"
        required={true}
        errors={state?.fieldErrors.content}
      />
      <TextInput
        name="tags"
        placeholder="태그 작성.."
        errors={state?.fieldErrors.tags}
      />
      <div>
        <label
          htmlFor="media"
          className="w-14 h-14 border-2 border-dashed rounded-md text-neutral-300 flex justify-center items-center hover:text-neutral-700 hover:border-neutral-700 dark:hover:text-neutral-400 dark:hover:border-neutral-400 hover:cursor-pointer"
        >
          <PlusIcon className="size-6" />
        </label>
        <input type="file" className="hidden" id="media" />
      </div>
      <SubmitButton text="글쓰기" />
    </form>
  );
}
