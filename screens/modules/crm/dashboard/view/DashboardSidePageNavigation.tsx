import React, { useContext, useState } from "react";
import IMAGES from "../../../../../images/index";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { DashboardSidePageNavigationItem } from "./DashboardSidePageNavigationItem";
import { MessageListContext } from "../../../../../pages/_app";
import { User } from "../../../../../models/Accounts";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { AccountActions } from "../../../../../account-actions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DashboardSidePageNavigationProps = {
  appName: string;
  modelName: string;
  dashboards: IDashboardDetails[];
  currentDashboard?: IDashboardDetails;
  defaultDashboard?: string;
  handleDashboardSelection?: (item: IDashboardDetails) => void;
  handlePreferencesChange: (item: IDashboardDetails, value: boolean) => void;
  setDeleteModal: (value: {
    visible: boolean;
    item: IDashboardDetails;
  }) => void;
  user: User | null;
  isCollapsed: boolean;
  handleActive?: (newValue: number) => number;
};

const DashboardSidePageNavigation = ({
  appName,
  modelName,
  dashboards,
  currentDashboard,
  defaultDashboard,
  handleDashboardSelection = () => {},
  handlePreferencesChange,
  setDeleteModal,
  user,
  isCollapsed,
}: DashboardSidePageNavigationProps) => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  const [currentPageNavigation, setCurrentPageNavigation] =
    React.useState<IDashboardDetails>();
  const router = useRouter();
  console.log("isCollapsed", isCollapsed);
  React.useEffect(() => {
    const basePath = router.asPath.split("/")[1];
    const fullPath = router.asPath;

    const matchedDashboard = dashboards.find((dashboard) => {
      const dashboardBasePath = dashboard.url.split("/")[1];
      return (
        dashboard.url === fullPath ||
        (dashboardBasePath === basePath && basePath === "meetings")
      );
    });

    if (matchedDashboard) {
      setCurrentPageNavigation(matchedDashboard);
      if (handleDashboardSelection) {
        handleDashboardSelection(matchedDashboard);
      }
    } else if (!currentPageNavigation && dashboards.length > 0) {
      setCurrentPageNavigation(dashboards[0]);
      if (handleDashboardSelection) {
        handleDashboardSelection(dashboards[0]);
      }
    }
  }, [router.asPath, dashboards, currentDashboard]);

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : ""
      }`}
    >
      <div
        className={`h-14 w-full items-center  ${
          isCollapsed ? "" : "flex justify-start"
        }`}
      >
        <Image src={IMAGES.LOGO} alt="logo_image" className="w-8 h-8 mx-2" />
        {!isCollapsed ? (
          <span className="text-[#2f98ff] text-[22px] font-semibold sm:text-[17px] md:text-[14px] lg:text-[16px] xl:text-[20px]">
            VrynoKalendar
          </span>
        ) : (
          <span className="text-[#2f98ff] text-[22px] font-semibold sm:text-[17px] md:text-[14px] lg:text-[16px] xl:text-[20px]">
            {/* VrynoKalendar */}
          </span>
        )}
      </div>
      {isCollapsed ? (
        <hr className="border-2 border-gray-300 w-12" />
      ) : (
        <hr className="border-2 border-gray-300" />
      )}

      <div
        className={`mt-2 w-full border-gray-300 overflow-y-auto overflow-x-hidden ${
          appMessage?.length > 0 && instanceMessage?.length > 0
            ? "h-[65vh] 2xl:h-[75vh]"
            : "h-[60vh] 2xl:h-[72vh]"
        }`}
      >
        {dashboards.map((dashboard, index) => (
          <div
            key={index}
            className={`relative group  ${isCollapsed ? "py-1" : ""}`}
          >
            <DashboardSidePageNavigationItem
              index={index}
              dashboard={dashboard}
              appName={appName}
              modelName={modelName}
              defaultDashboard={defaultDashboard}
              currentPageNavigation={currentPageNavigation}
              setCurrentPageNavigation={setCurrentPageNavigation}
              handleDashboardSelection={handleDashboardSelection}
              handlePreferencesChange={handlePreferencesChange}
              setDeleteModal={setDeleteModal}
              user={user}
              isCollapsed={isCollapsed}
            />
            {isCollapsed && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                            bg-gray-800 text-white px-2 py-1 rounded text-sm
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none whitespace-nowrap z-20"
              >
                {dashboard.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {isCollapsed ? (
        <hr className="border-2 border-gray-300 w-12" />
      ) : (
        <hr className="border-2 border-gray-300" />
      )}

      {AccountActions.map((item) => (
        <div
          className={`relative group py-2  ${isCollapsed ? "" : ""}`}
          key={item.id}
        >
          <Button
            onClick={() => router.push(item.url)}
            id={item.id}
            name={item.name}
            userEventName={item.userEventName}
            customStyle={`w-full flex  ${isCollapsed ? "justify-between " : ""} 
                         border-vryno-theme-light-blue px-2 py-2 hover:bg-gray-100 focus:bg-gray-100 
                         focus:outline-none focus:border-vryno-theme-light-blue 
                         focus:text-vryno-theme-light-blue focus:border-l-4 
                         focus:ring-vryno-theme-light-blue relative group`}
          >
            <div
              className={`flex justify-start gap-2${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              {item.icon && <item.icon className="h-6 w-6" />}
              {item.image && (
                <div className="h-6 w-6">
                  <img
                    className="bg-gray-600 rounded-full"
                    src={item.image}
                    alt={item.label}
                  />
                </div>
              )}
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {isCollapsed && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                            bg-white-800 text-black font-poppins px-2 py-1 rounded text-sm
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none whitespace-nowrap z-20"
              >
                {item.label}
              </div>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DashboardSidePageNavigation;
