import { get } from "lodash";
import { INavigation } from "../../../../../models/INavigation";

export const getNavigationLabel = ({
  navigations,
  currentModuleName,
  currentModuleLabel,
  defaultLabel,
}: {
  navigations: INavigation[];
  currentModuleName?: string;
  currentModuleLabel: string;
  defaultLabel: string;
}) => {
  const currentNavigabaleModule = navigations?.filter(
    (navigation) => navigation.navTypeMetadata?.moduleName === currentModuleName
  );
  const currentLabel = get(
    currentNavigabaleModule.length > 0 && currentNavigabaleModule[0].label,
    "en",
    currentModuleLabel ?? defaultLabel
  );
  return currentLabel;
};
