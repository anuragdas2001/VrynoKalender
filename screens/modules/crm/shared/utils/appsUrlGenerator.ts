import { paramCase } from "change-case";
import { SupportedApps } from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";

export const appsUrlGenerator = (
  appName: SupportedApps | string,
  modelName: string,
  actionName: AllowedViews,
  id: string | undefined = undefined,
  additionalParts: string[] = []
) => {
  let url = `/app/${appName}/${paramCase(
    modelName || "no-model-name"
  )}/${actionName}`;
  if (id) {
    url += `/${id}`;
  }
  for (const part of additionalParts) {
    if (part) {
      url += `/${part}`;
    }
  }
  return url;
};
