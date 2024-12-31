import React, { useContext, useEffect } from "react";
import PageNotFound from "../modules/crm/shared/components/PageNotFound";
import { getSortedFieldList } from "../modules/crm/shared/utils/getOrderedFieldsList";
import { VrynoHead } from "./VrynoHead";
import GeneralScreenLoader from "../modules/crm/shared/components/GeneralScreenLoader";
import { getAppPathParts } from "../modules/crm/shared/utils/getAppPathParts";
import {
  DashboardComponentMapper,
  GenericViewComponentMap,
} from "./GenericViewComponentMap";
import { IModuleMetadata } from "../../models/IModuleMetadata";
import { getNavigationLabel } from "../modules/crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../stores/RootStore/NavigationStore/NavigationStore";
import { GeneralStoreContext } from "../../stores/RootStore/GeneralStore/GeneralStore";
import { checkForAnyBackgroundProcessRunning } from "../modules/shared";
import { BackgroundProccessLoading } from "../../components/TailwindControls/Loading/BackgroundProcessLoading";
import { CalendarViewScreen } from "../modules/crm/generic/GenericCalendarView/CalendarViewScreen";
import { ILayout } from "../../models/ILayout";
import { ICustomField } from "../../models/ICustomField";
import { observer } from "mobx-react-lite";

export const GenericModuleLayout = observer(() => {
  let { appName, modelName, ui, id, relatedFilter, relatedFilterId } =
    getAppPathParts();
  let backgroundProcessCount = 0;
  const [modelNameFromNavigation, setModelNameFromNavigation] =
    React.useState<string>(modelName);
  const { navigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched, allModulesFetched } =
    generalModelStore;
  let currentLayout: ILayout | undefined =
    genericModels[modelName]?.layouts?.length > 0
      ? genericModels[modelName]?.layouts[0]
      : undefined;
  let fieldsList: ICustomField[] =
    genericModels[modelName]?.fieldsList &&
    genericModels[modelName]?.fieldsList?.length > 0
      ? getSortedFieldList(genericModels[modelName]?.fieldsList)
      : [];
  let moduleFetched: IModuleMetadata | undefined =
    genericModels[modelName]?.moduleInfo;

  React.useEffect(() => {
    if (modelName && allModulesFetched && allLayoutFetched) {
      moduleFetched = genericModels[modelName]?.moduleInfo
        ? genericModels[modelName]?.moduleInfo
        : undefined;
      fieldsList = genericModels[modelName]?.fieldsList
        ? getSortedFieldList(genericModels[modelName]?.fieldsList)
        : [];
      currentLayout =
        genericModels[modelName]?.layouts?.length > 0
          ? genericModels[modelName]?.layouts[0]
          : undefined;
      setModelNameFromNavigation(modelName);
    }
  }, [modelName, allModulesFetched, allLayoutFetched]);

  const [backgroundProccessRunning, setBackgroundProcessRunning] =
    React.useState<boolean>(false);

  let currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: moduleFetched?.name,
    currentModuleLabel: moduleFetched ? moduleFetched?.label.en : "",
    defaultLabel: `${modelName[0]?.toUpperCase()}${modelName?.slice(1)}`,
  });
  let ComponentToRender = GenericViewComponentMap[ui];

  React.useEffect(() => {
    const navigationEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const isPageReloaded = navigationEntries.some((navEntry) => {
      return navEntry.type === "reload" || navEntry.type === "navigate";
    });

    if (isPageReloaded || ui !== "view") {
      for (let i = 0; i <= localStorage.length; i++) {
        if (localStorage.key(i)?.includes("quickFilter")) {
          localStorage.removeItem(localStorage.key(i) ?? "");
        }
      }
    }
  }, [ui, modelName]);

  React.useEffect(() => {
    backgroundProcessCount = backgroundProcessCount + 1;
    setBackgroundProcessRunning(checkForAnyBackgroundProcessRunning());
  }, [JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }")]);

  if (modelName === "calendar") {
    return <CalendarViewScreen appName={appName} modelName={modelName} />;
  }

  if (ui === undefined) {
    return <GeneralScreenLoader modelName={"..."} />;
  }
  if (DashboardComponentMapper[ui]) {
    return DashboardComponentMapper[ui];
  }

  if (modelName !== modelNameFromNavigation) {
    return <GeneralScreenLoader modelName={"..."} />;
  }

  if (ComponentToRender) {
    return (
      <>
        <VrynoHead title={currentModuleLabel} />
        <BackgroundProccessLoading
          backgroundProcessLoading={backgroundProccessRunning}
        />
        <ComponentToRender
          appName={appName}
          modelName={modelName}
          fieldsList={fieldsList}
          currentLayout={currentLayout}
          id={id}
          relatedFilter={relatedFilter}
          relatedFilterId={relatedFilterId}
          currentModule={moduleFetched}
          backgroundProcessRunning={backgroundProccessRunning}
          setBackgroundProcessRunning={(value) =>
            setBackgroundProcessRunning(value)
          }
        />
      </>
    );
  } else {
    return <PageNotFound />;
  }
});
