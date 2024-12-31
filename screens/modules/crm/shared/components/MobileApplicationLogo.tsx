import { getAppPathParts } from "../utils/getAppPathParts";
import React from "react";

export function MobileApplicationLogo() {
  const webApplicationLogo: Record<string, string> = {
    vryno: "/vryno_new_logo.svg",
    crm: "/crm-logo-new.svg",
    accounts: "/crm_logo.svg",
  };
  const { appName } = getAppPathParts();
  return webApplicationLogo[appName] ? (
    <img
      src={webApplicationLogo[appName]}
      alt="mobile-logo"
      className="py-2.5 pl-4 w-24"
    />
  ) : (
    <img src="/crm-logo-new.svg" className="py-2.5 pl-4" alt="mobile-logo" />
  );
}
