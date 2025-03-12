"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import ProfileImage from "./image";
import { useActionState, useState } from "react";
import Textarea from "../../shared/inputs/textarea";
import { updateProfile, UpdateProfileForm } from "@/app/me/setting/action";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/libs/atoms";
import { ActionPrevState } from "@/types/form";
import { getImageUrl } from "@/libs/utils";
import SubmitButton from "../../shared/buttons/submit-button";
import { getUploadUrl } from "@/app/(common)/action";

interface EditProfileFormProps {
  username: string;
  avatar: string | null;
  loginId: string;
  bio: string | null;
}

export default function EditProfileForm({
  username,
  avatar,
  loginId,
  bio,
}: EditProfileFormProps) {
  const setAlert = useSetAtom(alertAtom);
  const [preview, setPreview] = useState<string | null>(avatar);
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      setAlert({
        visible: true,
        title: "너무 커요!",
        description: "2MB 이하의 이미지만 업로드 가능합니다.",
      });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAlert({
        visible: true,
        title: "멋진 파일이네요!",
        description: "이미지 파일만 업로드 가능합니다.",
      });
      return;
    }

    setPreview(URL.createObjectURL(file));

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setImageId(id);
      setUploadUrl(uploadURL);
    }
  };

  const uploadImage = async (image: FormDataEntryValue | null) => {
    if (!image) return "";

    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", image);
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

  const updateProfileWrapper = async (
    state: ActionPrevState<UpdateProfileForm>,
    formData: FormData
  ) => {
    try {
      const file = formData.get("avatar");
      if (file && typeof file === "object" && file.size > 0) {
        await uploadImage(file);
        const imageUrl = getImageUrl(imageId);
        formData.set("avatar", imageUrl);
      } else {
        formData.set("avatar", "");
      }

      return updateProfile(state, formData);
    } catch (e) {
      setAlert({
        visible: true,
        title: "죄송해요!",
        description: (e as Error).message,
      });
    }
  };

  const [state, action, pending] = useActionState(updateProfileWrapper, null);

  return (
    <form action={action}>
      <div className="bg-neutral-100 dark:bg-neutral-800 flex flex-col justify-end p-4 gap-4 relative">
        <div className="flex gap-5 items-center">
          <div className="size-20 rounded-md relative overflow-hidden">
            <label
              htmlFor="avatar"
              className="flex items-center justify-center absolute top-0 left-0 size-20 group cursor-pointer"
            >
              <PencilIcon className="size-6 opacity-40 group-hover:opacity-100" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                id="avatar"
                name="avatar"
                onChange={onImageChange}
              />
            </label>
            <ProfileImage avatar={preview} username={username} size={20} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h5 className="font-semibold">{username}</h5>
            </div>
            <p className="text-gray-400 text-sm">@{loginId}</p>
          </div>
        </div>
        <Textarea
          placeholder="이곳에 화끈한 자기소개 입력.."
          name="bio"
          defaultValue={bio ?? ""}
          errors={state?.fieldErrors.bio}
        />
        <SubmitButton text="프로필 업데이트" pending={pending} />
      </div>
    </form>
  );
}
