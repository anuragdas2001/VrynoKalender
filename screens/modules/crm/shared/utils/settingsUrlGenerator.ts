import { SettingsMenuItem } from "../../../../../models/Settings";
import { paramCase } from "param-case";
import { SupportedApps } from "../../../../../models/shared";

export const settingsUrlGenerator = (
  appName: SupportedApps,
  menuItem: string,
  id: string = "",
  additionalParts: string[] = []
) => {
  let url = `/settings/${paramCase(appName || "no-app")}/${paramCase(
    menuItem || "undefined"
  )}`;
  for (let i = 0; i < additionalParts.length; i++) {
    url += `/${paramCase(additionalParts[i] || "undefined")}`;
  }

  url += `/${paramCase(id || "")}`;
  return url;
};
