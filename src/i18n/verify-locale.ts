import "server-only";

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { i18n } from "./config.ts";

const getLocale = (request: NextRequest) => {
  const languages = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") ?? "",
    },
  }).languages();

  return match(languages, i18n.locales, i18n.defaultLocale);
};

const isLocaleSupported = (input: string) => {
  if (input.length !== 2) return false;

  const isNotSupported = i18n.locales.every((locale) => locale !== input);

  return !isNotSupported;
};

export const verifyLocale = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const [firstSegment, ...segments] = pathname.split("/").toSpliced(0, 1);
  const isPotentialLocale = firstSegment.length === 2;

  return isLocaleSupported(firstSegment)
    ? { needsRedirect: false, redirectPath: "" }
    : {
        needsRedirect: true,
        redirectPath: `/${getLocale(request)}/${isPotentialLocale ? "" : firstSegment}/${segments.join("/")}`,
      };
};
