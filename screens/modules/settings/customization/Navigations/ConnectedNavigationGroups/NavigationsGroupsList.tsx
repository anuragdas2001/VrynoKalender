import React from "react";
import { SupportedApps } from "../../../../../../models/shared";
import { INavigation } from "../../../../../../models/INavigation";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import { settingsUrlGenerator } from "../../../../crm/shared/utils/settingsUrlGenerator";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import {
  NavigationItems,
  SettingsMenuItem,
} from "../../../../../../models/Settings";

const navigationGroupTableHeaders = [
  {
    label: "Displayed At",
    columnName: "displayedAt",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Navigation Group",
    columnName: "groupKey",
    dataType: SupportedDataTypes.singleline,
  },
];

const groupKeyDisplayAtMap: Record<string, string> = {
  "default-navigation": "Top Menu",
};

const itemUrlGenerator = (item: INavigation) =>
  settingsUrlGenerator(
    SupportedApps.crm,
    SettingsMenuItem.navigationGroups,
    item.groupKey,
    [NavigationItems.navigationGroupItems]
  );

export type NavigationGroupListProps = {
  navigations: INavigation[];
};

const NavigationsGroupsList = ({ navigations }: NavigationGroupListProps) => {
  const justGroupKeys = navigations.map((nav) => nav.groupKey);
  const uniqueGroups = Array.from(new Set(justGroupKeys))
    .filter((n) => groupKeyDisplayAtMap[n])
    .map((navItem) => {
      return {
        groupKey: navItem,
        displayedAt: groupKeyDisplayAtMap[navItem],
      };
    });

  return (
    <GenericList
      data={uniqueGroups}
      tableHeaders={navigationGroupTableHeaders}
      listSelector={false}
      rowUrlGenerator={(item) => itemUrlGenerator(item)}
    />
  );
};

export default NavigationsGroupsList;
