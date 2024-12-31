import { camelCase } from "change-case";
import React from "react";
import SidePageMenuContainer from "../crm/shared/components/SidePageMenuContainer";

export type RecycleBinSideMenuProps = {
  menuItems: { label: string; name: string }[];
  modelName: string;
  menuLoading?: boolean;
  onMenuItemChange?: (item: { label: string; name: string }) => void;
};

const RecycleBinSideMenu = ({
  menuItems,
  modelName,
  menuLoading = false,
  onMenuItemChange = () => {},
}: RecycleBinSideMenuProps) => {
  const [currentPageNavigation, setCurrentPageNavigation] = React.useState<{
    label: string;
    name: string;
  }>();

  React.useEffect(() => {
    setCurrentPageNavigation(
      menuItems.filter((item) => item.name === camelCase(modelName))[0]
    );
  }, [menuItems]);

  return (
    <SidePageMenuContainer menuLoading={menuLoading}>
      <>
        {menuItems.map((item, index) => (
          <a
            className={`text-sm block py-1.5 px-4 my-1 cursor-pointer hover:bg-gray-100 break-all ${
              currentPageNavigation === item
                ? "bg-gray-100 text-vryno-theme-light-blue border-l-4 border-vryno-theme-light-blue"
                : ""
            }`}
            href={`#${item}`}
            onClick={(e) => {
              e.preventDefault();
              onMenuItemChange(item);
              setCurrentPageNavigation(item);
            }}
            key={index}
          >
            {item.label}
          </a>
        ))}
      </>
    </SidePageMenuContainer>
  );
};
export default RecycleBinSideMenu;
