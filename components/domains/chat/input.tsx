import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { InputHTMLAttributes } from "react";

interface ChatInputProps {
  errors?: string[];
  pending?: boolean;
}

export default function ChatInput({
  pending,
  ...attrs
}: ChatInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="fixed bottom-4 p-4 w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full ring-2 ring-neutral-200 dark:ring-neutral-600 pl-4 pr-14 py-3 rounded-3xl focus:ring-2 focus:ring-violet-400 focus:outline-none dark:bg-neutral-600 dark:text-white disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          autoCapitalize="none"
          autoCorrect="off"
          autoSave="off"
          disabled={pending}
          {...attrs}
        />
        <button
          className="absolute right-2 top-[7px] text-md p-2 bg-violet-400 rounded-3xl text-white disabled:bg-neutral-400 disabled:text-neutral-800 disabled:cursor-not-allowed"
          disabled={pending}
        >
          <ArrowUpIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
