import { useRouter } from "next/router";
import { camelCase } from "change-case";
import { SupportedApps } from "./../../../models/shared";

export const getSearchPathParts = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { query } = useRouter();
  const [app, model] = (query?.slug as string[]) ?? [];
  const appName = app?.toLowerCase();
  const modelName = camelCase(model || "") as SupportedApps;

  const queryParams = new URLSearchParams(window.location.search);
  const filterBy = queryParams.get("text");
  return { appName, modelName, filterBy };
};
