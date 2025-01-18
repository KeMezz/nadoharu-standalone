"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import ProfileImage from "../profile-image";
import { useState } from "react";
import Textarea from "../inputs/textarea";
import { useForm } from "react-hook-form";

interface EditProfileFormProps {
  username: string;
  avatar: string | null;
  login_id: string;
  bio: string | null;
}

interface EditProfileFormData {
  bio: string;
  avatar: File | null;
}

export default function EditProfileForm({
  username,
  avatar,
  login_id,
  bio,
}: EditProfileFormProps) {
  const { register, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: { bio: bio ?? "" },
  });

  const [preview, setPreview] = useState<string | null>(avatar);
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: EditProfileFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                id="avatar"
                {...register("avatar")}
                onChange={onImageChange}
              />
            </label>
            <ProfileImage avatar={preview} username={username} size={20} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h5 className="font-semibold">{username}</h5>
            </div>
            <p className="text-gray-400 text-sm">@{login_id}</p>
          </div>
        </div>
        <Textarea
          placeholder="이곳에 화끈한 자기소개 입력.."
          {...register("bio")}
        />
        <button className="mt-4 bg-violet-400 dark:bg-violet-600 focus:ring-violet-600 text-white w-full py-2 rounded-md outline-none focus:ring-2">
          프로필 업데이트
        </button>
      </div>
    </form>
  );
}
