import { getCsrfToken } from "next-auth/react";
import { init } from "../node_modules/next-auth/core/init"; // You have to import it like this
import getAuthorizationUrl from "../node_modules/next-auth/core/lib/oauth/authorization-url"; // You have to import it like this
import type { NextAuthOptions } from "next-auth";
import type { BuiltInProviderType } from "next-auth/providers";
import type { NextApiRequest } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { Config } from "./constants";

export async function getServerSignInUrl(
  req: NextApiRequest,
  cookies: NextApiRequestCookies,
  callbackUrl: string
) {
  console.log(process.env.NEXTAUTH_URL);

  console.log("callbackUrl: ", callbackUrl);
  const { options, cookies: initCookies } = await init({
    action: "signin",
    authOptions,
    origin: process.env.NEXTAUTH_URL,
    callbackUrl,
    cookies: req.cookies,
    isPost: true,
    csrfToken: await getCsrfToken({ req }),
    providerId: "vryno",
  });

  const { redirect, cookies: authCookies } = await getAuthorizationUrl({
    options,
    query: {},
  });
  return {
    redirect,
    cookies: [...initCookies, ...(authCookies || [])],
  };
}
