import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { INavigation } from "../../../../../models/INavigation";

export const getSortedModuleByNavigation = (
  navigations: INavigation[],
  modules: IModuleMetadata[]
) => {
  let orderedModulesInNavigationList: IModuleMetadata[] = [];
  let orderedModulesNotInNavigationList: IModuleMetadata[] = [];
  if (!navigations || navigations?.length <= 0) return modules;

  modules?.forEach((module: IModuleMetadata) => {
    const findIndexInNavigation = navigations?.findIndex(
      (navigation: INavigation) =>
        navigation?.navTypeMetadata?.moduleName === module.name
    );

    if (findIndexInNavigation === -1) return;
    orderedModulesInNavigationList = [
      ...orderedModulesInNavigationList,
      { ...module, order: navigations[findIndexInNavigation].order },
    ];
  });

  modules?.forEach((module: IModuleMetadata) => {
    const findIndexInOrderedModulesInNavigationList =
      orderedModulesInNavigationList?.findIndex(
        (orderedModule: IModuleMetadata) => orderedModule.name === module.name
      );
    if (findIndexInOrderedModulesInNavigationList === -1) {
      orderedModulesNotInNavigationList = [
        ...orderedModulesNotInNavigationList,
        module,
      ];
    }
  });

  orderedModulesInNavigationList = [
    ...orderedModulesInNavigationList
      .slice()
      .sort((a, b) => (a.order > b.order ? 1 : -1)),
    ...orderedModulesNotInNavigationList,
  ];
  return orderedModulesInNavigationList;
};
