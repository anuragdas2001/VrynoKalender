import React from "react";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import MenuOpenIcon from "remixicon-react/MenuUnfoldLineIcon";
import MenuCloseIcon from "remixicon-react/MenuFoldLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";

export type DashboardHeaderProps = {
  currentDashboard?: IDashboardDetails;
  menuVisible: boolean;
  setMenuVisible: (value: boolean) => void;
};

export const DashboardHeader = ({
  currentDashboard,
  menuVisible = false,
  setMenuVisible,
}: DashboardHeaderProps) => {
  return (
    <GenericBackHeader
      showBackButton={false}
      heading={currentDashboard?.name}
      replaceBackButton={true}
      replaceBackButtonChildren={
        <>
          <Button
            onClick={() => setMenuVisible(true)}
            id={"dashboard-sidebar-open"}
            customStyle=""
            userEventName="dashboard-sidebar-open:action-click"
          >
            <MenuOpenIcon
              className={`text-vryno-theme-light-blue cursor-pointer ${
                menuVisible ? "hidden" : ""
              }`}
            />
          </Button>
          <Button
            onClick={() => setMenuVisible(false)}
            id={"dashboard-sidebar-close"}
            customStyle=""
            userEventName="dashboard-sidebar-close:action-click"
          >
            <MenuCloseIcon
              className={`text-vryno-theme-light-blue cursor-pointer ${
                menuVisible ? "" : "hidden"
              }`}
            />
          </Button>
        </>
      }
    />
  );
};
