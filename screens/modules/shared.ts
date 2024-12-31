import { Config } from "../../shared/constants";
import { NextRouter } from "next/router";
import { IInstance } from "../../models/Accounts";

const publicRootUrl = (instance: IInstance) =>
  Config.publicRootUrl({
    appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
    appSubDomain: instance?.subdomain,
  });

export function redirectAsPerInstances(
  instances: IInstance[],
  router: NextRouter,
  locale?: string
) {
  switch (instances?.length) {
    case 0:
      router
        .replace(Config.instancesAddUrl, Config.instancesAddUrl, { locale })
        .then();
      break;
    case 1:
      const oneInstanceUrl = `${publicRootUrl(instances[0])}${locale}/${
        Config.crmApplicationPath
      }`;
      window.location.replace(oneInstanceUrl);
      break;
    default:
      router
        .replace(Config.instancesUrl, Config.instancesUrl, { locale })
        .then();
      break;
  }
}

export const updateBackgroundProcessingInSession = (
  key: string,
  value: boolean
) => {
  localStorage.setItem(
    "BackgroundProccessRunning",
    localStorage.getItem("BackgroundProccessRunning")
      ? JSON.stringify({
          ...JSON.parse(
            localStorage.getItem("BackgroundProccessRunning") ?? ""
          ),
          [key]: value,
        })
      : JSON.stringify({ [key]: value })
  );
};

export const checkForAnyBackgroundProcessRunning = () => {
  let flag = false;
  let backgroundProcessRunning = localStorage.getItem(
    "BackgroundProccessRunning"
  )
    ? JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }")
    : {};
  for (let key in backgroundProcessRunning) {
    if (backgroundProcessRunning[key] === true) {
      flag = true;
      break;
    }
  }
  return flag;
};

export const updateAllLayoutFetchInSession = (value: boolean) => {
  localStorage.setItem("AllLayoutFetch", JSON.stringify(value));
};

export const checkForAllLayoutFetchProcessRunning = () => {
  const status: boolean = localStorage.getItem("AllLayoutFetch")
    ? JSON.parse(localStorage.getItem("AllLayoutFetch") ?? "")
    : false;
  return status;
};
