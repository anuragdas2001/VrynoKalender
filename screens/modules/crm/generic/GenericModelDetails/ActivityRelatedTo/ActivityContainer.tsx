import React from "react";
import { SingleActivityContainer } from "./SingleActivityContainer";
import { ActivityContainerProps } from "./activityRelatedToHelper";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";

export const ActivityContainer = ({
  id,
  appName,
  modelName,
  parentModelName,
  recordId,
  status,
  extended = false,
  setActivityCount = () => {},
  activitiesTable,
  fieldsListDict,
  activityStatus,
  userPreferences,
  sideNavigationRefreshed,
  handleActivityStatusChange,
  changedStatusRecord,
  resetActivityStatusChangeData,
  handleUpdateUserPreferences,
  handleOpenCollapseCardContainer = () => {},
  setExecuteActivitySave,
  executeActivitySave,
}: ActivityContainerProps) => {
  const [callLogsCount, setCallLogsCount] = React.useState<number>(0);
  const [meetingsCount, setMeetingsCount] = React.useState<number>(0);
  const [tasksCount, setTasksCount] = React.useState<number>(0);

  const handleActivityCount = (value: number, activityName: string) => {
    const activity = activitiesTable?.filter(
      (activity) => activity.name === activityName
    )[0];
    activity.name === "callLog"
      ? setCallLogsCount(value)
      : activity.name === "meeting"
      ? setMeetingsCount(value)
      : setTasksCount(value);
  };

  React.useEffect(() => {
    setActivityCount(callLogsCount + meetingsCount + tasksCount, status);
  }, [callLogsCount, meetingsCount, tasksCount]);

  const statusArray =
    status === "Open"
      ? activityStatus?.filter((obj) =>
          ["Open", "In Progress", "Hold"].includes(obj.defaultLabel)
        )
      : activityStatus?.filter((obj) =>
          ["Cancelled", "Close"].includes(obj.defaultLabel)
        );

  return activitiesTable?.length === 0 ? (
    <GenericHeaderCardContainer
      cardHeading={`${status} Activities`}
      extended={extended}
      id={id}
      userPreferences={userPreferences}
      modelName={parentModelName}
      handleOpenCollapseCardContainer={(id, showDetails) =>
        handleOpenCollapseCardContainer(id, showDetails)
      }
    >
      <div className="w-full flex items-center justify-center">
        <span className="text-sm text-gray-600">
          Activities module not visible
        </span>
      </div>
    </GenericHeaderCardContainer>
  ) : (
    <GenericHeaderCardContainer
      cardHeading={`${status} Activities`}
      extended={extended}
      id={id}
      userPreferences={userPreferences}
      modelName={parentModelName}
      handleOpenCollapseCardContainer={(id, showDetails) =>
        handleOpenCollapseCardContainer(id, showDetails)
      }
    >
      <div
        className={`grid ${
          activitiesTable?.length === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : activitiesTable?.length === 2
            ? "sm:grid-cols-2"
            : ""
        } gap-x-8`}
      >
        {activitiesTable.map((activity, index) => (
          <SingleActivityContainer
            key={index}
            appName={appName}
            status={status}
            modelName={modelName}
            relatedName={activity.relatedName}
            recordId={recordId}
            activity={{
              name: activity.name,
              alias: activity.displayedAs,
              icon: activity.icon,
            }}
            activityCount={
              activity.name === "callLog"
                ? callLogsCount
                : activity.name === "meeting"
                ? meetingsCount
                : activity.name === "task"
                ? tasksCount
                : 0
            }
            setActivityCount={(value, activityName) =>
              handleActivityCount(value, activityName)
            }
            sideNavigationRefreshed={sideNavigationRefreshed}
            statusArray={statusArray}
            userPreferences={userPreferences}
            activityType={status.toLowerCase()}
            fieldsList={fieldsListDict[activity.name]}
            handleActivityStatusChange={handleActivityStatusChange}
            changedStatusRecord={
              changedStatusRecord &&
              activity.name === changedStatusRecord.moduleName
                ? changedStatusRecord
                : null
            }
            handleUpdateUserPreferences={handleUpdateUserPreferences}
            resetActivityStatusChangeData={resetActivityStatusChangeData}
            relatedToField={
              fieldsListDict?.[activity?.name]?.filter(
                (field) => field.name === "relatedTo"
              )?.[0] || null
            }
            setExecuteActivitySave={setExecuteActivitySave}
            executeActivitySave={executeActivitySave}
          />
        ))}
      </div>
    </GenericHeaderCardContainer>
  );
};
