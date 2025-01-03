"use client";

import { cls } from "@/libs/utils";
import { NextPage } from "next";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  color?: "violet" | "red" | "gray";
}

const SubmitButton: NextPage<SubmitButtonProps> = ({
  text,
  type = "submit",
  onClick,
  color = "violet",
}) => {
  const buttonColor = (color: "violet" | "red" | "gray") => {
    switch (color) {
      case "violet":
        return "bg-violet-400 dark:bg-violet-600 focus:ring-violet-600 text-white";
      case "red":
        return "bg-rose-600 focus:ring-rose-700 text-white";
      case "gray":
        return "bg-gray-200 focus:ring-gray-400 text-black";
    }
  };
  const { pending } = useFormStatus();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      className={cls(
        "px-4 py-2 rounded-md outline-none focus:ring-2 ",
        buttonColor(color),
        pending ? "bg-neutral-400 text-black" : ""
      )}
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
};

export default SubmitButton;
