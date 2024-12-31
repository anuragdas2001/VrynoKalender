import React from "react";
import { Config } from "../../shared/constants";
import { NextRouter, useRouter } from "next/router";
import { Toast } from "../../components/TailwindControls/Toast";
import { cookieUserStore } from "../../shared/CookieUserStore";

const checkTokenTime = 60000;

const manageUser = (router: NextRouter, toast: typeof Toast) => {
  const { locale } = router;
  if (!cookieUserStore.isUserDetailsValid()) {
    toast.warning("Session Expired, Please login again");
    console.info("Token expired, redirecting to login");
    cookieUserStore.clear();
    router.replace(Config.loginUrl, Config.loginUrl, { locale }).then();
    return;
  } else {
    console.info("Token checked, still valid");
  }
  setTimeout(() => {
    manageUser(router, toast);
  }, checkTokenTime);
};

export const UserSessionManager = ({
  userId,
}: {
  userId: string | undefined;
}) => {
  const router = useRouter();
  React.useEffect(() => {
    if (!userId) {
      return;
    }
    setTimeout(() => {
      manageUser(router, Toast);
    }, checkTokenTime);
  }, [userId]);
  return <></>;
};
