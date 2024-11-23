import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  const nextCookies = await cookies();
  return getIronSession<SessionContent>(nextCookies, {
    cookieName: "nadoharu",
    password: process.env.COOKIE_PASSWORD!,
  });
}
