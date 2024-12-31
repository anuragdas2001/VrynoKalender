import React, { useContext } from "react";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { DashboardHeader } from "./DashboardHeader";
import DashboardSidePageNavigation from "./DashboardSidePageNavigation";
import { DashboardWidget } from "./DashboardWidget";
import CloseIcon from "remixicon-react/CloseLineIcon";
import { MobileApplicationLogo } from "../../shared/components/MobileApplicationLogo";
import NoDataFoundContainer from "../../shared/components/NoDataFoundContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { IUserPreference } from "../../../../../models/shared";
import _ from "lodash";
import { MessageListContext } from "../../../../../pages/_app";
import { User } from "../../../../../models/Accounts";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type DashboardScreenProps = {
  appName: string;
  modelName: string;
  currentDashboard?: IDashboardDetails;
  dashboards: IDashboardDetails[];
  defaultDashboard?: string;
  handleDashboardSelection: (item: IDashboardDetails) => void;
  menuVisible: boolean;
  userPreferences: IUserPreference[];
  setMenuVisible: (value: boolean) => void;
  handlePreferencesChange: (item: IDashboardDetails, value: boolean) => void;
  setDeleteModal: (value: {
    visible: boolean;
    item: IDashboardDetails;
  }) => void;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

export const DashboardScreen = ({
  appName,
  modelName,
  currentDashboard,
  dashboards,
  defaultDashboard,
  handleDashboardSelection = () => {},
  menuVisible = false,
  userPreferences,
  setMenuVisible,
  handlePreferencesChange,
  setDeleteModal,
  handleWidgetViewOnPreference,
  user,
  genericModels,
  allLayoutFetched,
}: DashboardScreenProps) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const { appMessage, instanceMessage } = useContext(MessageListContext);

  return (
    <>
      <div
        className={`sidebar w-1/2 px-4 py-3 bg-white min-h-screen overflow-y-scroll fixed inset-y-0 left-0 sm:hidden transform ${sideMenuClass} transition duration-200 ease-in-out z-[600] shadow-md pb-[60px]`}
      >
        <div className="w-full flex flex-row justify-between items-center mb-5 mt-1">
          <span>
            <MobileApplicationLogo />
          </span>
          <Button
            id="close-mobile-menu-dashboard"
            onClick={() => {
              setSideMeuClass("-translate-x-full");
              setMenuVisible(false);
            }}
            customStyle=""
            userEventName="dashboard-mobile-view-close:action-click"
          >
            <CloseIcon />
          </Button>
        </div>
        <DashboardSidePageNavigation
          appName={appName}
          modelName={modelName}
          dashboards={dashboards}
          defaultDashboard={defaultDashboard}
          currentDashboard={currentDashboard}
          handlePreferencesChange={handlePreferencesChange}
          handleDashboardSelection={(item) => handleDashboardSelection(item)}
          setDeleteModal={setDeleteModal}
          user={user}
        />
      </div>
      <div className="flex w-full h-full ">
        <div
          className={`min-h-screen overflow-y-auto fixed inset-y-0 shadow-md left-0 ${
            appMessage?.length > 0 && instanceMessage?.length > 0
              ? `mt-[120px] sm:mt-[126px] md:mt-[100px]`
              : appMessage?.length > 0 || instanceMessage?.length > 0
              ? `mt-[100px] sm:mt-[106px] md:mt-[80px]`
              : "mt-20 sm:mt-21.5 md:mt-15"
          } bg-white hidden sm:w-4/12 md:w-3/12 lg:w-1/5 xl:w-2/12 px-4 py-2 z-[600] ${
            menuVisible ? "sm:block" : ""
          } pb-[60px]`}
        >
          <DashboardSidePageNavigation
            appName={appName}
            modelName={modelName}
            dashboards={dashboards}
            defaultDashboard={defaultDashboard}
            currentDashboard={currentDashboard}
            handlePreferencesChange={handlePreferencesChange}
            handleDashboardSelection={(item) => handleDashboardSelection(item)}
            setDeleteModal={setDeleteModal}
            user={user}
          />
        </div>

        <div
          className={`flex flex-col w-full h-full ${
            menuVisible
              ? "sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12"
              : ""
          }`}
        >
          <DashboardHeader
            currentDashboard={currentDashboard}
            menuVisible={menuVisible}
            setMenuVisible={(value) => {
              setMenuVisible(value);
              setSideMeuClass("");
            }}
          />
          <div className="my-5 px-5 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 5xl:grid-cols-4 md:gap-x-6 gap-y-6">
            {currentDashboard && currentDashboard.widgets?.length > 0 ? (
              currentDashboard.widgets.map((widgetId, index) => (
                <DashboardWidget
                  key={index}
                  timezone={
                    userPreferences?.length > 0
                      ? _.get(userPreferences[0], "defaultPreferences", "")
                        ? _.get(
                            userPreferences[0]?.defaultPreferences,
                            "localInformation",
                            ""
                          )
                          ? _.get(
                              userPreferences[0]?.defaultPreferences
                                ?.localInformation,
                              "timezone",
                              ""
                            )
                          : " "
                        : ""
                      : ""
                  }
                  widgetId={widgetId}
                  user={user}
                  userPreferences={userPreferences}
                  genericModels={genericModels}
                  allLayoutFetched={allLayoutFetched}
                  handleWidgetViewOnPreference={handleWidgetViewOnPreference}
                />
              ))
            ) : (
              <div
                className={`w-[95vw] h-full flex items-center justify-center`}
              >
                <NoDataFoundContainer
                  showButton={false}
                  containerMessage={`No widget available right now.`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
