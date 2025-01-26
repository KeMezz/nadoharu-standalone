"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import SubmitButton from "../buttons/submit-button";
import TextInput from "../inputs/text-input";
import Textarea from "../inputs/textarea";
import { useActionState, useState } from "react";
import { uploadPost, UploadPostForm } from "@/app/posts/upload/action";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/libs/atoms";
import Image from "next/image";
import { getUploadUrl } from "@/app/(common)/action";
import { ActionPrevState } from "@/types/form";
import { getImageUrl } from "@/libs/utils";

const maxImageSizeMb = 5;
const maxImages = 4;

export default function UploadForm() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadUrls, setUploadUrls] = useState<
    { id: string; uploadURL: string; file: File }[]
  >([]);
  const setAlert = useSetAtom(alertAtom);

  const validateImageFile = (file: File) => {
    if (file.size > 1024 * 1024 * maxImageSizeMb) {
      throw new Error(`${maxImageSizeMb}MB 이하의 이미지만 업로드 가능합니다.`);
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드 가능합니다.");
    }
  };

  const uploadImage = async (file: File, uploadUrl: string) => {
    if (!file) return "";

    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareFormData,
    });
    if (response.status !== 200) {
      throw new Error(
        "이미지 저장소에 문제가 있는 것 같아요. 잠시 후에 다시 시도해주세요."
      );
    }
  };

  const onPreviewClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    preview: string,
    index: number
  ) => {
    e.preventDefault();
    setAlert({
      visible: true,
      title: "아래 이미지를 삭제할까요?",
      descriptionElement: (
        <Image
          src={preview}
          alt="preview"
          width={1600}
          height={1000}
          className="object-cover rounded-md"
        />
      ),
      extraBtn: true,
      extraBtnColor: "red",
      extraBtnText: "삭제하기",
      extraBtnAction: () => {
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setUploadUrls((prev) => prev.filter((_, i) => i !== index));
      },
      closeBtn: true,
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      Array.from(files).forEach((file) => {
        validateImageFile(file);
      });

      // 이미 업로드된 이미지 수 확인
      if (previews.length + files.length > maxImages) {
        throw new Error(
          `이미지는 최대 ${maxImages}개까지만 업로드할 수 있어요.`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          visible: true,
          title: "잠시만요!",
          description: error.message,
        });
      }
      return;
    }

    // 파일 미리보기 생성
    const newPreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews((prev) => [...prev, ...newPreviews]);

    // 업로드 URL 발급
    Array.from(files).forEach(async (file) => {
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrls((prev) => [...prev, { id, uploadURL, file }]);
      }
    });
  };

  const uploadPostWrapper = async (
    state: ActionPrevState<UploadPostForm>,
    formData: FormData
  ) => {
    try {
      if (!uploadUrls) return;
      if (uploadUrls.length > 4) return;

      let imageUrls: string[] = [];
      await Promise.all(
        uploadUrls.map(async ({ id, uploadURL, file }) => {
          await uploadImage(file, uploadURL);
          const imageUrl = getImageUrl(id);
          imageUrls = [...imageUrls, imageUrl];
        })
      );
      formData.set("photos", JSON.stringify(imageUrls));

      return uploadPost(state, formData);
    } catch (e) {
      setAlert({
        visible: true,
        title: "죄송해요!",
        description: (e as Error).message,
      });
    }
  };
  const [state, action, pending] = useActionState(uploadPostWrapper, null);

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
          <button
            key={index}
            type="button"
            onClick={(e) => onPreviewClick(e, preview, index)}
          >
            <Image
              src={preview}
              alt="preview"
              className="size-14 rounded-md object-cover"
              width={56}
              height={56}
            />
          </button>
        ))}
      </div>
      <SubmitButton text="글쓰기" pending={pending} />
    </form>
  );
}
