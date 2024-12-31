import { useRouter } from "next/router";
import { camelCase } from "change-case";
import { SupportedApps, SupportedViewType } from "../../../../../models/shared";

export const getAppPathParts = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { query } = useRouter();
  const [appNameInUrl, model, view, record_id, relatedFilter, relatedFilterId] =
    (query?.slug as string[]) ?? [];
  const appName = appNameInUrl?.toLowerCase() as SupportedApps;
  const modelName = camelCase(model || (query["model"] as string) || "");
  const ui = view?.toLowerCase() as SupportedViewType;
  const id = record_id?.toLowerCase();
  return { appName, modelName, ui, id, relatedFilter, relatedFilterId };
};
