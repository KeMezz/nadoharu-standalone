import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { InputHTMLAttributes } from "react";

interface TextInputProps {
  defaultValue?: string;
  loading?: boolean;
  errors?: string[];
}

export default function TextInput({
  defaultValue,
  errors = [],
  loading,
  ...attrs
}: TextInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        autoSave="off"
        autoComplete="off"
        disabled={loading}
        defaultValue={defaultValue}
        {...attrs}
        className="appearance-none w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 px-4 py-2 dark:bg-neutral-700 dark:text-white"
      />
      {errors?.length ? (
        <div className="flex flex-col gap-2">
          {errors.map((error, i) => (
            <p
              key={i}
              className="text-red-500 font-medium flex items-center gap-2 text-sm"
            >
              <ExclamationTriangleIcon className="size-4 mt-[0.5px]" />
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
