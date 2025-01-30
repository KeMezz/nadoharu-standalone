"use server";

import db from "@/libs/db";
import { z } from "zod";
import * as constants from "@/libs/constants";
import bcrypt from "bcrypt";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

type LoginActionState = {
  fieldErrors: {
    login_id?: string[];
    password?: string[];
  };
  formErrors?: string[];
};

const checkLoginIdExists = async (login_id: string) => {
  const user = await db.user.findUnique({
    where: {
      login_id,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  login_id: z
    .string()
    .refine(checkLoginIdExists, constants.INVALID_USER_MESSAGE),
  password: z
    .string()
    .min(constants.PASSWORD_MIN_LENGTH, constants.INVALID_USER_MESSAGE)
    .regex(constants.PASSWORD_REGEX, constants.INVALID_USER_MESSAGE),
});

export async function login(_: LoginActionState | null, formData: FormData) {
  const data = {
    login_id: formData.get("login_id"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return {
      fieldErrors: {
        password: [constants.INVALID_USER_MESSAGE],
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
      login_id: result.data.login_id,
    },
    select: {
      id: true,
      password: true,
    },
  });
  const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
  if (ok) {
    const session = await getSession();
    session.id = user!.id;
    await session.save();
    redirect("/posts");
  } else {
    return {
      fieldErrors: {
        password: [constants.INVALID_USER_MESSAGE],
      },
    };
  }
}
