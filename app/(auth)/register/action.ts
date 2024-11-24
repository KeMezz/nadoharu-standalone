"use server";

import { z } from "zod";
import * as constants from "@/libs/constants";
import db from "@/libs/db";
import bcrypt from "bcrypt";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkLoginId = (username: string) =>
  !username.endsWith("-github") ||
  !username.endsWith("-apple") ||
  !username.endsWith("-kakao");

const formSchema = z
  .object({
    login_id: z
      .string({
        invalid_type_error: constants.INVALID_TYPE_ERROR_MESSAGE,
        required_error: constants.REQUIRED_ERROR_MESSAGE,
      })
      .min(constants.LOGIN_ID_MIN_LENGTH, constants.LOGIN_ID_MIN_ERROR_MESSAGE)
      .max(constants.LOGIN_ID_MAX_LENGTH, constants.LOGIN_ID_MAX_ERROR_MESSAGE)
      .regex(constants.LOGIN_ID_REGEX, constants.LOGIN_ID_REGEX_ERROR_MESSAGE)
      .refine(checkLoginId, constants.USERNAME_RULE_ERROR_MESSAGE),
    password: z
      .string()
      .min(constants.PASSWORD_MIN_LENGTH, constants.PASSWORD_MIN_ERROR_MESSAGE)
      .regex(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR_MESSAGE),
    confirm_password: z
      .string()
      .min(constants.PASSWORD_MIN_LENGTH, constants.PASSWORD_MIN_ERROR_MESSAGE),
    username: z
      .string({
        invalid_type_error: constants.INVALID_TYPE_ERROR_MESSAGE,
        required_error: constants.REQUIRED_ERROR_MESSAGE,
      })
      .min(constants.USERNAME_MIN_LENGTH, constants.USERNAME_MIN_ERROR_MESSAGE)
      .max(constants.USERNAME_MAX_LENGTH, constants.USERNAME_MAX_ERROR_MESSAGE)
      .toLowerCase()
      .trim(),
  })
  .superRefine(async ({ login_id }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        login_id,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: constants.LOGIN_ID_ALREADY_EXISTS_MESSAGE,
        path: ["login_id"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: constants.PASSWORD_NOT_MATCH_MESSAGE,
    path: ["confirm_password"],
  });

export default async function register(_: any, formData: FormData) {
  const data = {
    login_id: formData.get("login_id"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    username: formData.get("username"),
  };

  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      login_id: result.data.login_id,
      username: result.data.username,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = user.id;
  await session.save();

  redirect("/posts");
}
