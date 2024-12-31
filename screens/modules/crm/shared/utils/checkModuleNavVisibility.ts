import { INavigation } from "../../../../../models/INavigation";

export const checkModuleNavVisibility = (
  navigations: INavigation[],
  moduleName: string
) => {
  const currentNavigableModule = navigations?.filter(
    (navigation) => navigation.navTypeMetadata?.moduleName === moduleName
  );
  return currentNavigableModule?.length && currentNavigableModule[0].visible;
};
