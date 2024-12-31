import React, { useEffect, useRef } from "react";
import { SettingsSideBar } from "./SettingsSidebar";
import { SettingsComponentMap } from "./SettingsComponentMap";
import { getSettingsPathParts } from "../crm/shared/utils/getSettingsPathParts";
import { SettingsMenuItem } from "../../../models/Settings";
import { setHeight } from "../crm/shared/utils/setHeight";
import { useWindowSize } from "../crm/shared/utils/useWindowSize";
import SidePageMenuContainer from "../crm/shared/components/SidePageMenuContainer";
import { observer } from "mobx-react-lite";

const menuItemReducer: Partial<
  Record<SettingsMenuItem, (allParts: string[]) => string>
> = {
  "module-fields": (allParts: string[]) =>
    allParts.slice(0, 2).reduce(defaultAggregator, ""),
  navigation: (allParts: string[]) =>
    allParts.slice(0, 2).reduce(defaultAggregator, ""),
};

const defaultAggregator = (aggregate: string, current: string) =>
  aggregate ? aggregate + "." + current : current;
export const Settings = observer(() => {
  const { menuItem, additionalParts } = getSettingsPathParts();
  let { id } = getSettingsPathParts();
  const allParts = [menuItem, ...additionalParts];
  const reducer = menuItemReducer[menuItem as SettingsMenuItem];
  const menuItemToRender = reducer
    ? reducer(allParts)
    : allParts.reduce(defaultAggregator, "");
  let settingMenuItem = menuItemToRender as SettingsMenuItem;

  if (id === "" && additionalParts[0] === "permissions") {
    settingMenuItem = `${menuItem}.${additionalParts[0]}` as SettingsMenuItem;
    id = `${additionalParts[additionalParts.length - 1]}`;
  }

  const sideRef = useRef(null);
  const [width] = useWindowSize();

  useEffect(() => {
    if (sideRef) {
      setHeight(sideRef);
    }
  }, [width]);

  const ComponentToRender = SettingsComponentMap[settingMenuItem];
  return (
    <div className="flex w-full">
      <SidePageMenuContainer>
        <SettingsSideBar />
      </SidePageMenuContainer>
      <div className="flex flex-col w-full sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 h-full sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12">
        {ComponentToRender && <ComponentToRender id={id} />}
      </div>
    </div>
  );
});
