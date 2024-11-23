"use client";

import { login } from "@/app/(auth)/login/action";
import SubmitButton from "../submit-button";
import TextInput from "../text-input";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/libs/constants";

export default function LoginForm() {
  const [state, action] = useActionState(login, null);
  return (
    <form action={action} className="flex flex-col gap-4 p-8">
      <TextInput
        name="email"
        type="email"
        placeholder="이메일"
        required={true}
        errors={state?.fieldErrors.email}
      />
      <TextInput
        name="password"
        type="password"
        placeholder="비밀번호"
        required={true}
        errors={state?.fieldErrors.password}
        minLength={PASSWORD_MIN_LENGTH}
      />
      <SubmitButton text="로그인" />
    </form>
  );
}
