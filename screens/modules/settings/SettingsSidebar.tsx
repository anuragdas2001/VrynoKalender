import React, { useContext } from "react";
import { SubMenu } from "./SubMenu";
import { getSettingsPathParts } from "../crm/shared/utils/getSettingsPathParts";
import { INavigation } from "../../../models/INavigation";
import { observer } from "mobx-react-lite";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { UserStoreContext } from "../../../stores/UserStore";
import { SettingsPermissionsMapper } from "./SettingsAllowedValues";
import { User } from "../../../models/Accounts";
import { SettingsMenuItem } from "../../../models/Settings";

function checkPermission(
  navigation: INavigation,
  user: User | null
): boolean | undefined {
  if (user === null) {
    return false;
  }
  if (navigation.uniqueName in SettingsPermissionsMapper) {
    const permissionChecker =
      SettingsPermissionsMapper[navigation.uniqueName as SettingsMenuItem];
    return permissionChecker ? permissionChecker(user) : false;
  }
  return false;
}

export const SettingsSideBar = observer(() => {
  const { navigations } = useContext(NavigationStoreContext);
  const { user } = useContext(UserStoreContext);

  const parentLeftNav = navigations.filter(
    (val) => val.groupKey === "settings-left-menu"
  );

  const childNavItems = navigations.filter(
    (val) =>
      val.groupKey !== "profile-menu" &&
      val.groupKey !== "default-navigation" &&
      val.groupKey !== "settings-left-menu"
  );

  const allowedNavItems = childNavItems.filter((val) => {
    //Remove below line in future to allow role and permission
    // if (val.uniqueName === "role-permission") return false;
    return checkPermission(val, user);
  });

  return (
    <>
      {parentLeftNav.map((item, index) => {
        return (
          <SubMenu
            parentNavItem={item}
            allowedNavItems={allowedNavItems}
            // isExpanded={isExpanded(item)}
            childNavItems={allowedNavItems}
            key={index}
          />
        );
      })}
    </>
  );
});
