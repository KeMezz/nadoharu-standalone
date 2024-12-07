import { NextRequest, NextResponse } from "next/server";
import getSession from "./libs/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/login": true,
  "/register": true,
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  const session = await getSession();
  const exists = publicOnlyUrls[pathname];
  if (!session.id) {
    if (!exists || pathname === "/") {
      console.log(session.id, request.nextUrl.pathname, exists);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (exists || pathname === "/") {
      return NextResponse.redirect(new URL("/posts", request.url));
    }
  }
}
