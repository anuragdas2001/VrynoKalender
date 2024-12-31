import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { BaseClientLayout } from "./BaseClientLayout";
import { Config } from "../../shared/constants";
import { cookieUserStore } from "../../shared/CookieUserStore";
import { MixpanelActions } from "../Shared/MixPanel";

const isAtRegisterOrLogin = (currentUrl: string) =>
  onlyUnauthenticatedAccess.some((item) => currentUrl.includes(item));

const onlyUnauthenticatedAccess = [
  Config.loginUrl,
  Config.logoutUrl,
  Config.registerUrl,
  Config.forgotPasswordUrl,
  Config.resetPasswordUrl,
  Config.acceptInviteUrl,
];

export const GenericAuthenticationLayout = ({
  title,
  children,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const router = useRouter();
  const currentUrl = router.asPath;
  const { locale } = router;
  const userId = cookieUserStore.getUserId();

  // const previousUserId = usePrevious(userId);

  useEffect(() => {
    // console.log(`User id value is ${userId}`);
    // console.log(
    //   "User was not in context but user was found in store, setting it onto context"
    // );
    // if (userId && isAtRegisterOrLogin(currentUrl)) {
    //   router.push(instancesUrl, instancesUrl, { locale }).then();
    //   return;
    // }

    const loginUser = cookieUserStore.getUserDetails();

    if (!loginUser) {
      if (!isAtRegisterOrLogin(currentUrl)) {
        cookieUserStore.redirectToLogin();
        // router.replace(Config.loginUrl, Config.loginUrl, { locale }).then();
      }
      return;
    }
    // if (userId) {
    //   MixpanelActions.registerOnce({ userId: userId });
    // }
    if (window.location.hostname.split(".")[0]) {
      MixpanelActions.register({
        subdomain: window.location.hostname.split(".")[0],
      });
    }
    if (currentUrl) {
      MixpanelActions.track(
        `Navigate:${
          window?.location?.hostname?.split(".")[0] || "-"
        }:${currentUrl}`,
        {
          url: currentUrl,
          type: "navigate",
        }
      );
    }
  }, [userId, currentUrl, router, locale]);

  if (isAtRegisterOrLogin(currentUrl) && !userId)
    return <BaseClientLayout title={title}>{children}</BaseClientLayout>;

  return (
    <BaseClientLayout title={title}>
      {userId && (
        <>
          {/*<UserSessionManager userId={userId} />*/}
          {children}
        </>
      )}
    </BaseClientLayout>
  );
};
