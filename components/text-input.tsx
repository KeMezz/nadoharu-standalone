import { NextPage } from "next";

interface TextInputProps {
  type?: "text" | "email" | "password";
  placeholder?: string;
  defaultValue?: string;
  loading?: boolean;
}

const TextInput: NextPage<TextInputProps> = ({
  type = "text",
  placeholder,
  defaultValue,
  loading,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      autoComplete="off"
      autoSave="off"
      disabled={loading}
      className="appearance-none w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 px-4 py-2"
    />
  );
};

export default TextInput;
