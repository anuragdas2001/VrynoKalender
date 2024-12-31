import React from "react";
import TaskIcon from "remixicon-react/TaskLineIcon";
import PhoneIcon from "remixicon-react/PhoneLineIcon";
import { ActivityContainer } from "./ActivityContainer";
import MeetingIcon from "remixicon-react/CalendarLineIcon";
import { IGenericActivityLabel } from "../TypesGenericModelDetails";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  FieldsListDictType,
  IActivitiesTable,
  IChangedStatusRecord,
  RelatedActivityStatusType,
} from "./activityRelatedToHelper";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";

export const ConnectedActivityContainer = ({
  id,
  appName,
  modelName,
  parentModelName,
  recordId,
  extended,
  type,
  navActivityModuleLabels,
  userPreferences,
  fieldsListDataLoading,
  activityStatusLoading,
  fieldsListDict,
  activityStatus,
  changedStatusRecord,
  sideNavigationRefreshed,
  resetActivityStatusChangeData,
  handleActivityStatusChange,
  setActivityCount,
  handleUpdateUserPreferences,
  handleOpenCollapseCardContainer = () => {},
  setExecuteActivitySave,
  executeActivitySave,
}: {
  id: string;
  appName: SupportedApps;
  modelName: string;
  parentModelName?: string;
  recordId: string;
  extended?: boolean;
  type: "Open" | "Closed";
  navActivityModuleLabels: IGenericActivityLabel;
  userPreferences: IUserPreference[];
  fieldsListDataLoading: boolean;
  activityStatusLoading: boolean;
  fieldsListDict: FieldsListDictType;
  activityStatus: RelatedActivityStatusType[];
  changedStatusRecord: IChangedStatusRecord;
  sideNavigationRefreshed: boolean;
  resetActivityStatusChangeData: () => void;
  handleUpdateUserPreferences: () => void;
  handleActivityStatusChange: (
    activityData: any,
    currentActivityStatus: string,
    moduleName: string
  ) => void;
  setActivityCount?: (count: number, type: string) => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  setExecuteActivitySave: React.Dispatch<any>;
  executeActivitySave: any;
}) => {
  const [activitiesTable, setActivitiesTable] = React.useState<
    IActivitiesTable[] | []
  >([
    {
      relatedName: "call-log",
      name: "callLog",
      displayedAs: "Call Logs",
      icon: <PhoneIcon className="text-vryno-activity-header mr-2" size={20} />,
    },
    {
      relatedName: "meeting",
      name: "meeting",
      displayedAs: "Meetings",
      icon: (
        <MeetingIcon className="text-vryno-activity-header mr-2" size={20} />
      ),
    },
    {
      relatedName: "task",
      name: "task",
      displayedAs: "Tasks",
      icon: <TaskIcon className="text-vryno-activity-header mr-2" size={20} />,
    },
  ]);

  React.useEffect(() => {
    const callLogData = navActivityModuleLabels.callLog
      ? {
          ...activitiesTable[0],
          displayedAs: navActivityModuleLabels.callLog,
        }
      : null;
    const meetingData = navActivityModuleLabels.meeting
      ? {
          ...activitiesTable[1],
          displayedAs: navActivityModuleLabels.meeting,
        }
      : null;
    const taskData = navActivityModuleLabels.task
      ? {
          ...activitiesTable[2],
          displayedAs: navActivityModuleLabels.task,
        }
      : null;

    const result: IActivitiesTable[] = [];
    [callLogData, meetingData, taskData].forEach((activity) => {
      if (activity !== null) {
        result.push(activity);
      }
    });
    setActivitiesTable(result);
  }, [navActivityModuleLabels]);

  const ActivityContainerMapper: { [type: string]: React.JSX.Element } = {
    Open: (
      <ActivityContainer
        id={id}
        appName={appName}
        modelName={modelName}
        parentModelName={parentModelName}
        recordId={recordId}
        status="Open"
        extended={extended}
        setActivityCount={setActivityCount}
        activitiesTable={activitiesTable}
        fieldsListDict={fieldsListDict}
        activityStatus={activityStatus}
        userPreferences={userPreferences}
        sideNavigationRefreshed={sideNavigationRefreshed}
        handleActivityStatusChange={handleActivityStatusChange}
        changedStatusRecord={
          changedStatusRecord.status === "open" ? changedStatusRecord : null
        }
        handleUpdateUserPreferences={handleUpdateUserPreferences}
        resetActivityStatusChangeData={resetActivityStatusChangeData}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
        setExecuteActivitySave={setExecuteActivitySave}
        executeActivitySave={executeActivitySave}
      />
    ),
    Closed: (
      <ActivityContainer
        id={id}
        appName={appName}
        modelName={modelName}
        parentModelName={parentModelName}
        recordId={recordId}
        status="Closed"
        extended={extended}
        setActivityCount={setActivityCount}
        activitiesTable={activitiesTable}
        fieldsListDict={fieldsListDict}
        activityStatus={activityStatus}
        userPreferences={userPreferences}
        sideNavigationRefreshed={sideNavigationRefreshed}
        handleActivityStatusChange={handleActivityStatusChange}
        changedStatusRecord={
          changedStatusRecord.status === "closed" ? changedStatusRecord : null
        }
        handleUpdateUserPreferences={handleUpdateUserPreferences}
        resetActivityStatusChangeData={resetActivityStatusChangeData}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
        setExecuteActivitySave={setExecuteActivitySave}
        executeActivitySave={executeActivitySave}
      />
    ),
  };

  return fieldsListDataLoading || activityStatusLoading ? (
    <div className="mb-13">
      <ItemsLoader currentView="List" loadingItemCount={2} />
    </div>
  ) : (
    ActivityContainerMapper[type]
  );
};
