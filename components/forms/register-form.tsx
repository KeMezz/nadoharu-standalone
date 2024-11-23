"use client";

import { useActionState, useEffect, useState } from "react";
import SubmitButton from "../submit-button";
import TextInput from "../text-input";
import register from "@/app/(auth)/register/action";

export default function RegisterForm() {
  const [formState, setFormState] = useState({
    login_id: "",
    username: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const [state, action] = useActionState(register, null);

  return (
    <form action={action} className="flex flex-col gap-4 p-8">
      <TextInput
        name="login_id"
        type="text"
        placeholder="아이디"
        value={formState.login_id}
        onChange={handleInputChange}
        required={true}
        errors={state?.fieldErrors.login_id}
      />
      <TextInput
        name="password"
        type="password"
        placeholder="비밀번호"
        required={true}
        errors={state?.fieldErrors.password}
      />
      <TextInput
        name="confirm_password"
        type="password"
        placeholder="비밀번호 확인"
        required={true}
        errors={state?.fieldErrors.confirm_password}
      />
      <hr className="my-3" />
      <TextInput
        name="username"
        placeholder="별명"
        value={formState.username}
        onChange={handleInputChange}
        required={true}
        errors={state?.fieldErrors.username}
        warning="다른 이용자에게 불쾌감을 줄 수 있는 별명은 삼가해주세요!"
      />
      <SubmitButton text="회원가입" />
    </form>
  );
}
