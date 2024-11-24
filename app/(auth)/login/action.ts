"use server";

import db from "@/libs/db";
import { z } from "zod";
import * as constants from "@/libs/constants";
import bcrypt from "bcrypt";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email({ message: constants.EMAIL_ERROR_MESSAGE })
    .toLowerCase()
    .refine(checkEmailExists, constants.INVALID_USER_MESSAGE),
  password: z
    .string()
    .min(constants.PASSWORD_MIN_LENGTH, constants.INVALID_USER_MESSAGE)
    .regex(constants.PASSWORD_REGEX, constants.INVALID_USER_MESSAGE),
});

export async function login(_: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  }

  const user = await db.user.findUnique({
    where: {
      email: result.data.email,
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
    redirect("/home");
  } else {
    return {
      fieldErrors: {
        email: [constants.INVALID_USER_MESSAGE],
        password: [constants.INVALID_USER_MESSAGE],
      },
    };
  }
}
