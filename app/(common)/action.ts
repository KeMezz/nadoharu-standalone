"use server";

import * as constants from "@/libs/constants";

export async function getUploadUrl() {
  const response = await fetch(constants.CF_DIRECT_UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CF_API_TOKEN}` },
  });
  const data = await response.json();

  return data;
}
