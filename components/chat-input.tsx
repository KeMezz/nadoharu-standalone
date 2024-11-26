import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { NextPage } from "next";

interface ChatInputProps {
  placeholder?: string;
  errors?: string[];
}

const ChatInput: NextPage<ChatInputProps> = ({ placeholder }) => {
  return (
    <div className="fixed bottom-0 p-4 w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full border pl-4 pr-14 py-3 rounded-3xl focus:ring-2 ring-violet-400 focus:outline-none dark:bg-neutral-600 dark:text-white"
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect="off"
          autoSave="off"
        />
        <button className="absolute right-2 top-[7px] text-md p-2 bg-violet-400 rounded-3xl text-white">
          <ArrowUpIcon className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
