import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { InputHTMLAttributes } from "react";

interface TextareaProps {
  errors?: string[];
}

function Textarea({
  errors = [],
  ...attrs
}: TextareaProps & InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="w-full px-4 py-2 border rounded-md shadow-sm outline-none resize-none border-neutral-300 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 dark:bg-neutral-700 dark:text-white"
        rows={3}
        {...attrs}
      >
        {attrs.value ?? ""}
      </textarea>
      {errors?.length ? (
        <div className="flex flex-col gap-2">
          {errors.map((error, i) => (
            <p
              key={i}
              className="text-red-500 font-medium flex items-center gap-2 text-sm"
            >
              <ExclamationTriangleIcon className="size-4" />
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Textarea;
