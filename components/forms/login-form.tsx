"use client";

import { login } from "@/app/(auth)/login/action";
import SubmitButton from "../buttons/submit-button";
import TextInput from "../inputs/text-input";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/libs/constants";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="flex flex-col gap-4 p-8">
      <TextInput
        name="loginId"
        type="text"
        placeholder="아이디"
        required={true}
      />
      <TextInput
        name="password"
        type="password"
        placeholder="비밀번호"
        required={true}
        errors={state?.fieldErrors?.password}
        minLength={PASSWORD_MIN_LENGTH}
      />
      <SubmitButton text="로그인" pending={pending} />
    </form>
  );
}
