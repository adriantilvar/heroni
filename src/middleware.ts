import { type NextRequest, NextResponse } from "next/server";
import { verifyLocale } from "./i18n/verify-locale.ts";

export const middleware = async (request: NextRequest) => {
  const { needsRedirect, redirectPath } = verifyLocale(request);

  if (needsRedirect) {
    request.nextUrl.pathname = redirectPath;
    return NextResponse.redirect(request.nextUrl);
  }
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
