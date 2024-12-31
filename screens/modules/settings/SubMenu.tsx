import React from "react";
import Link from "next/link";
import RightArrow from "remixicon-react/ArrowRightSLineIcon";
import DownArrow from "remixicon-react/ArrowDownSLineIcon";
import { getSettingsPathParts } from "../crm/shared/utils/getSettingsPathParts";
import { settingsUrlGenerator } from "../crm/shared/utils/settingsUrlGenerator";
import { SupportedApps } from "../../../models/shared";
import { INavigation } from "../../../models/INavigation";

export const SubMenu = ({
  parentNavItem,
  childNavItems,
  allowedNavItems,
}: // isExpanded,
{
  parentNavItem: INavigation;
  childNavItems: INavigation[];
  allowedNavItems: INavigation[];
  // isExpanded: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { menuItem } = getSettingsPathParts();

  const groupChildItems = childNavItems.filter(
    (val: { groupKey: string }) => val.groupKey === parentNavItem.uniqueName
  );

  const isExpanded = (item: INavigation) =>
    allowedNavItems
      .filter((i) => item.uniqueName == i.groupKey)
      .map((c) => c.uniqueName)
      .includes(menuItem);

  React.useEffect(() => {
    setIsOpen(isExpanded(parentNavItem));
  }, [menuItem, allowedNavItems]);

  return (
    <>
      {groupChildItems.length > 0 ? (
        <a
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="flex flex-row justify-between cursor-pointer font-medium text-sm mt-4 "
        >
          {parentNavItem.label.en}
          {parentNavItem && isOpen ? (
            <DownArrow />
          ) : parentNavItem ? (
            <RightArrow />
          ) : null}
        </a>
      ) : null}
      {isOpen &&
        groupChildItems.map((val: INavigation) => {
          return (
            <Link
              legacyBehavior
              href={{
                pathname: settingsUrlGenerator(
                  SupportedApps.crm,
                  val.uniqueName,
                  val.uniqueName === "templates" ? "email-template" : ""
                ),
              }}
              key={val.uniqueName}
            >
              <a
                className={`text-sm block py-1.5 px-4 my-1 cursor-pointer hover:bg-gray-100 ${
                  menuItem === val.uniqueName
                    ? "bg-gray-100 text-vryno-theme-light-blue border-l-4 border-vryno-theme-light-blue"
                    : ""
                }`}
              >
                {val.label.en}
              </a>
            </Link>
          );
        })}
    </>
  );
};
