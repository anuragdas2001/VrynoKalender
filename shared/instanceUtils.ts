import { Config } from "./constants";

export const atRootApp = () => {
  if (!process.browser) return false;
  return (
    window.location.hostname === `${Config.appSubDomain}.${Config.appHostName}`
  );
};
