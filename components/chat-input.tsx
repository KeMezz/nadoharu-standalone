import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { InputHTMLAttributes } from "react";

interface ChatInputProps {
  errors?: string[];
}

export default function ChatInput({
  ...attrs
}: ChatInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="fixed bottom-4 p-4 w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full shadow-md pl-4 pr-14 py-3 rounded-3xl focus:ring-2 ring-violet-400 focus:outline-none dark:bg-neutral-600 dark:text-white"
          autoCapitalize="none"
          autoCorrect="off"
          autoSave="off"
          {...attrs}
        />
        <button className="absolute right-2 top-[7px] text-md p-2 bg-violet-400 rounded-3xl text-white">
          <ArrowUpIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
