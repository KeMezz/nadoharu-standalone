"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import SubmitButton from "../buttons/submit-button";
import TextInput from "../inputs/text-input";
import Textarea from "../inputs/textarea";
import { useActionState, useState } from "react";
import { uploadPost } from "@/app/posts/upload/action";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/libs/atoms";
import Image from "next/image";

const maxImages = 4;

export default function UploadForm() {
  const [state, action] = useActionState(uploadPost, null);
  const [previews, setPreviews] = useState<string[]>([]);
  const setAlert = useSetAtom(alertAtom);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 이미 업로드된 이미지 수 확인
    if (previews.length + files.length > maxImages) {
      setAlert({
        visible: true,
        title: "너무 많아요!",
        description: `이미지는 최대 ${maxImages}개까지만 업로드할 수 있어요.`,
      });
      return;
    }

    // 파일 미리보기 생성
    const newPreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

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
      <div className="flex gap-2">
        <div>
          <label
            htmlFor="photos"
            className={`w-14 h-14 border-2 border-dashed rounded-md text-neutral-300 flex justify-center items-center ${
              previews.length >= maxImages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:text-neutral-700 hover:border-neutral-700 dark:hover:text-neutral-400 dark:hover:border-neutral-400"
            }`}
          >
            <PlusIcon
              className={`size-6 ${
                previews.length >= maxImages ? "rotate-45" : ""
              }`}
            />
          </label>
          <input
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            id="photos"
            name="photos"
            disabled={previews.length >= maxImages}
            onChange={onFileChange}
          />
        </div>
        {previews.map((preview, index) => (
          <button key={index} type="button">
            <Image
              src={preview}
              alt="preview"
              className="size-14 rounded-md"
              width={56}
              height={56}
            />
          </button>
        ))}
      </div>
      <SubmitButton text="글쓰기" />
    </form>
  );
}
