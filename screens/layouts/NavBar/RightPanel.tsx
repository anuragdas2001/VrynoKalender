import { InitialAndProfileMenu } from "./InitialAndProfileMenu";
import { GlobalSearch } from "./RightPanelItems/GlobalSearch";
import React from "react";
import { sliderWindowType } from "../../modules/crm/shared/components/SliderWindow";
import { QuickAdd } from "./RightPanelItems/QuickAdd";
import { IFormModalObject } from "../../modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { CalendarView } from "./RightPanelItems/CalendarView";
import { IInstance, User } from "../../../models/Accounts";
import { NotificationScreen } from "./RightPanelItems/NotificationScreen";
import { INavigation } from "../../../models/INavigation";
import { SupportedApps } from "../../../models/shared";
import { IGenericModel } from "../../../stores/RootStore/GeneralStore/GenericModelStore";

export type RightPanelProps = {
  appName: SupportedApps;
  disableButton: boolean;
  navbarColor?: string;
  navbarTextColor: string;
  allNotificationClass: string;
  filteredNavigations: INavigation[];
  currentInstance: IInstance | null;
  setAllNotificationClass: (value: string) => void;
  setQuickAddModal: (value: IFormModalObject) => void;
  setGlobalSearchModal: (value: sliderWindowType) => void;
  instances: IInstance[];
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
};

export const RightPanel = ({
  appName,
  disableButton,
  navbarColor,
  navbarTextColor,
  filteredNavigations,
  allNotificationClass,
  currentInstance,
  setAllNotificationClass,
  setQuickAddModal,
  setGlobalSearchModal,
  instances,
  user,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  removeModuleDataById,
}: RightPanelProps) => {
  const [isUserAvailable, setIsUserAvailable] = React.useState(true);
  const handleUserAvailable = (isAvailable: boolean) => {
    if (isAvailable !== isUserAvailable) {
      setIsUserAvailable(isAvailable);
    }
  };

  return (
    <div className="flex flex-row justify-end items-center w-[275px]">
      {isUserAvailable ? (
        <div className="flex items-center justify-center gap-x-2 xl:gap-x-3 pr-3">
          <QuickAdd
            appName={appName}
            disabled={disableButton}
            filteredNavigations={filteredNavigations}
            navbarColor={navbarColor}
            navbarTextColor={
              navbarTextColor === "black" ? "darkslategrey" : navbarTextColor
            }
            setQuickAddModal={(value) => setQuickAddModal(value)}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
          />
          <CalendarView
            appName={appName}
            disabled={disableButton}
            navbarTextColor={
              navbarTextColor === "black" ? "darkslategrey" : navbarTextColor
            }
          />
          <GlobalSearch
            disableSearchButton={disableButton}
            navbarColor={navbarColor}
            navbarTextColor={
              navbarTextColor === "black" ? "darkslategrey" : navbarTextColor
            }
            setGlobalSearchModal={(value) => setGlobalSearchModal(value)}
          />
          <NotificationScreen
            disabled={disableButton}
            navbarColor={navbarColor}
            navbarTextColor={
              navbarTextColor === "black" ? "darkslategrey" : navbarTextColor
            }
            allNotificationClass={allNotificationClass}
            user={user}
            removeModuleDataById={removeModuleDataById}
            setAllNotificationClass={(value) => setAllNotificationClass(value)}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="hidden sm:block">
        <p
          className="mr-2 text-[11px] max-w-[71px] line-clamp-3 leading-[13px] max-h-[40px]"
          title={currentInstance?.name || ""}
          id="header-instance-name"
        >
          {currentInstance?.name || ""}
        </p>
      </div>
      <InitialAndProfileMenu
        currentInstance={currentInstance}
        instances={instances}
        navbarColor={navbarColor}
        navbarTextColor={
          navbarTextColor === "black" ? "darkslategrey" : navbarTextColor
        }
        handleUserAvailable={handleUserAvailable}
        appName={appName}
      />
    </div>
  );
};
