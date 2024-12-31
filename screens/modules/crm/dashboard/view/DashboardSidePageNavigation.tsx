import React, { useContext } from "react";
// import Button from "../../../../../components/TailwindControls/Form/Button/Button";
// import AddIcon from "remixicon-react/AddCircleFillIcon";
// import WidgetIcon from "remixicon-react/BarChartBoxLineIcon";
// import { useRouter } from "next/router";
import IMAGES from "../../../../../images/index";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { DashboardSidePageNavigationItem } from "./DashboardSidePageNavigationItem";
import { MessageListContext } from "../../../../../pages/_app";
import { User } from "../../../../../models/Accounts";
import Image from "next/image";
import { useRouter } from "next/router";

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
}: DashboardSidePageNavigationProps) => {
  // const router = useRouter();
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  const [currentPageNavigation, setCurrentPageNavigation] =
    React.useState<IDashboardDetails>();
  const router = useRouter();
  React.useEffect(() => {
    if (dashboards && currentDashboard) {
      setCurrentPageNavigation(currentDashboard);
    } else {
      setCurrentPageNavigation(dashboards[0]);
    }
  }, [dashboards, currentDashboard]);
  React.useEffect(() => {
    // Sync the URL with the selected dashboard
    const matchedDashboard = dashboards.find(
      (dashboard) => dashboard.url === router.asPath
    );
    if (matchedDashboard) {
      setCurrentPageNavigation(matchedDashboard);
    } else if (dashboards.length > 0) {
      setCurrentPageNavigation(dashboards[0]);
    }
  }, [router.asPath, dashboards]);
  return (
    <>
      {/* <div className="mb-3">
        <Button
          id={`add-dashboard-button`}
          onClick={() => {
            router.push(`${appName}/${modelName}/add-dashboard`);
          }}
          kind="back"
          userEventName="open-add-dashboard-page-click"
        >
          <span
            className={`px-3 md:px-4 sm:px-6 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
          >
            <AddIcon size={16} className="mr-2" />
            <span className="text-sm">Dashboard</span>
          </span>
        </Button>
      </div>
      <div className="mb-3">
        <Button
          id={`widgets-button`}
          onClick={() => {
            router.push(`${appName}/${modelName}/view-widgets`);
          }}
          kind="back"
          userEventName="open-widget-list-page-click"
        >
          <span
            className={`px-4 sm:px-6 flex justify-center items-center w-full h-full`}
          >
            <WidgetIcon
              size={16}
              className="mr-2 text-vryno-theme-light-blue"
            />
            <span className="text-sm">Widgets</span>
          </span>
        </Button>
      </div> */}

      <div className="h-14 w-full my-1 flex justify-start items-center gap-1">
        <Image src={IMAGES.LOGO} alt="logo_image" className="w-10 h-10" />
        <span className="text-[#2f98ff] text-[22px] font-semibold sm:text-[17px] md:text-[14px] lg:text-[16px] xl:text-[20px]">
          VrynoKalendar
        </span>
      </div>
      <hr className={`border-[2px] border-gray-300`} />
      <div
        className={`mt-2 w-full ${
          appMessage?.length > 0 && instanceMessage?.length > 0
            ? `h-[60vh] 2xl:h-[70vh]`
            : appMessage?.length > 0 || instanceMessage?.length > 0
            ? `h-[65vh] 2xl:h-[75vh]`
            : `h-[70vh] 2xl:h-[80vh]`
        } border-gray-300 overflow-y-auto overflow-x-hidden`}
      >
        {dashboards.map((dashboard, index) => (
          <DashboardSidePageNavigationItem
            key={index}
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
          />
        ))}
      </div>
      <hr className={`border-[2px] border-gray-300`} />
    </>
  );
};
export default DashboardSidePageNavigation;
