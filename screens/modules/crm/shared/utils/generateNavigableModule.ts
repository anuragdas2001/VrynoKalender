import { camelCase } from "change-case";
import { INavigation } from "../../../../../models/INavigation";

export const generateNavigableModule = ({
  navigations,
  groupKey,
  pathName,
}: {
  navigations: INavigation[];
  groupKey: string;
  pathName: string;
}) => {
  let shortPathName = "";
  pathName.split("-").forEach((name) => {
    shortPathName = shortPathName + name[0];
  });
  return `${shortPathName}-${camelCase(
    navigations?.filter((navigation) => navigation.groupKey === groupKey)[0]
      ?.navTypeMetadata["moduleName"]
  )}`;
};
