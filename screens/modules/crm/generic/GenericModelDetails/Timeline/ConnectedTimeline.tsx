import React from "react";
import { pascalCase } from "change-case";
import { TimelineContent } from "./TimelineContent";
import { IGenericActivityLabel } from "../TypesGenericModelDetails";
import { ICustomField } from "../../../../../../models/ICustomField";
import { ActivitiesModule } from "../../../../../../shared/constants";
import { OperationVariables, QueryResult, useLazyQuery } from "@apollo/client";
import {
  auditLogDataExtractor,
  TimelineEventType,
} from "./auditLogDataExtractor";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import {
  getAuditLogs,
  getAuditLogsActivityFilter,
} from "../../../../../../graphql/queries/auditLogQuery";
import { toast } from "react-toastify";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const ConnectedTimeline = ({
  appName,
  modelName,
  recordId,
  userPreferences,
  fieldsList,
  navActivityModuleLabels,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: {
  appName: SupportedApps;
  modelName: string;
  recordId: string;
  userPreferences: IUserPreference[];
  fieldsList: ICustomField[];
  navActivityModuleLabels: IGenericActivityLabel;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}) => {
  const moduleArray = ["note", "attachment"];
  if (!(modelName in ActivitiesModule)) {
    if (navActivityModuleLabels.task) moduleArray.push("task");
    if (navActivityModuleLabels.meeting) moduleArray.push("meeting");
    if (navActivityModuleLabels.callLog) moduleArray.push("callLog");
  }
  const [timelineDataLoading, setTimelineDataLoading] = React.useState(true);
  const [filteredTimelineData, setFilteredTimelineData] = React.useState<
    TimelineEventType[]
  >([]);

  const [timelineFilter, setTimelineFilter] = React.useState("All");
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [showLoadMore, setShowLoadMore] = React.useState(false);
  const [timelineDataReload, setTimelineDataReload] = React.useState(false);

  const AUDIT_LOG_QUERY = getAuditLogs(pascalCase(modelName));

  const [getAuditLogData] = useLazyQuery(AUDIT_LOG_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const AUDIT_LOG_ACTIVITY_FILTER_QUERY = getAuditLogsActivityFilter(
    pascalCase(modelName),
    timelineFilter.toLowerCase()
  );

  const [getAuditLogActivityFilterData] = useLazyQuery(
    AUDIT_LOG_ACTIVITY_FILTER_QUERY,
    {
      fetchPolicy: "no-cache",
      nextFetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    }
  );

  const getAuditLogFilterData = (pageNumber: number) => {
    getAuditLogActivityFilterData({
      variables: {
        recordId: recordId,
        pageNumber: pageNumber,
        event_types: ["activityCreate", "activityUpdate", "activityDelete"],
        activity_type:
          timelineFilter.toLowerCase() === "note"
            ? "NoteActivity"
            : timelineFilter.toLowerCase() === "attachment"
            ? "AttachmentActivity"
            : timelineFilter.toLowerCase() === "calllog"
            ? "CallLogActivity"
            : timelineFilter.toLowerCase() === "meeting"
            ? "MeetingActivity"
            : "TaskActivity",
      },
    }).then((response) => {
      if (response?.data?.getAuditLogs) {
        const responseData = response.data.getAuditLogs;
        const sortedData = !responseData?.length
          ? []
          : auditLogDataExtractor(responseData);
        setFilteredTimelineData(sortedData);
        setTimelineDataLoading(false);
        if (responseData.length < 50) {
          setShowLoadMore(false);
        }
      } else {
        setShowLoadMore(false);
        setTimelineDataLoading(false);
      }
    });
  };

  React.useEffect(() => {
    if (timelineFilter === "All" || !appName) return;
    setShowLoadMore(true);
    setTimelineDataLoading(true);
    setCurrentPageNumber(1);
    getAuditLogFilterData(1);
  }, [timelineFilter, appName]);

  function handleGetAuditLogDataResponse(
    response: QueryResult<any, OperationVariables>,
    includeFilterTimelineData: boolean
  ) {
    if (response?.data?.getAuditLogs) {
      const responseData = response.data.getAuditLogs;
      const sortedData = !responseData?.length
        ? []
        : auditLogDataExtractor(responseData);
      setFilteredTimelineData(
        includeFilterTimelineData
          ? [...filteredTimelineData, ...sortedData]
          : sortedData
      );
      setTimelineDataLoading(false);
      if (responseData.length < 50) {
        setShowLoadMore(false);
      }
    } else {
      toast.error("Failed to fetch audit log data. Please try again.");
      setShowLoadMore(false);
      setTimelineDataLoading(false);
    }
  }

  const updateTimelineFilter = (module: string): void => {
    setTimelineFilter(module);
    if (module === "All") {
      setCurrentPageNumber(1);
      setShowLoadMore(true);
      setTimelineDataLoading(true);
      getAuditLogData({
        variables: { recordId: recordId, pageNumber: 1 },
      }).then((response): void => {
        handleGetAuditLogDataResponse(response, false);
      });
    }
  };

  function handleReloadData(response: QueryResult<any, OperationVariables>) {
    if (response?.data?.getAuditLogs) {
      const responseData = response.data.getAuditLogs;
      const sortedData = !responseData?.length
        ? []
        : auditLogDataExtractor(responseData);
      const filteredDataResult: TimelineEventType[] = [];
      sortedData.forEach((data) => {
        let isDataExist = false;
        filteredTimelineData.forEach((filteredData) => {
          if (data.id === filteredData.id) {
            isDataExist = true;
          }
        });
        if (!isDataExist) filteredDataResult.push(data);
      });
      setFilteredTimelineData(
        filteredTimelineData?.length
          ? [...filteredDataResult, ...filteredTimelineData]
          : sortedData
      );
      setTimelineDataLoading(false);
      if (responseData.length < 50) {
        setShowLoadMore(false);
      }
    } else {
      toast.error("Failed to fetch audit log data. Please try again.");
      setShowLoadMore(false);
      setTimelineDataLoading(false);
    }
  }

  const handleDataReload = () => {
    setCurrentPageNumber(1);
    setShowLoadMore(true);
    setTimelineDataReload(true);
    if (timelineFilter === "All") {
      getAuditLogData({
        variables: { recordId: recordId, pageNumber: 1 },
      }).then((response) => {
        handleReloadData(response);
        setTimelineDataReload(false);
      });
    } else {
      getAuditLogActivityFilterData({
        variables: {
          recordId: recordId,
          pageNumber: 1,
          event_types: ["activityCreate", "activityUpdate", "activityDelete"],
          activity_type:
            timelineFilter.toLowerCase() === "note"
              ? "NoteActivity"
              : timelineFilter.toLowerCase() === "attachment"
              ? "AttachmentActivity"
              : timelineFilter.toLowerCase() === "calllog"
              ? "CallLogActivity"
              : timelineFilter.toLowerCase() === "meeting"
              ? "MeetingActivity"
              : "TaskActivity",
        },
      }).then((response) => {
        handleReloadData(response);
        setTimelineDataReload(false);
      });
    }
  };

  const getAuditLogAllData = (pageNumber: number) => {
    setTimelineDataLoading(true);
    getAuditLogData({
      variables: { recordId: recordId, pageNumber: pageNumber },
    }).then((response) => handleGetAuditLogDataResponse(response, true));
  };

  const handleAuditDataLoadMore = () => {
    const updatedPageNumber = currentPageNumber + 1;
    setCurrentPageNumber(updatedPageNumber);
    if (timelineFilter === "All") {
      getAuditLogAllData(updatedPageNumber);
    } else {
      getAuditLogFilterData(updatedPageNumber);
    }
  };

  React.useEffect(() => {
    setShowLoadMore(true);
    getAuditLogAllData(1);
  }, []);

  return (
    <TimelineContent
      recordId={recordId}
      modelName={modelName}
      userPreferences={userPreferences}
      moduleArray={moduleArray}
      updateTimelineFilter={updateTimelineFilter}
      timelineFilter={timelineFilter}
      filteredTimelineData={filteredTimelineData}
      fieldsList={fieldsList}
      timelineDataLoading={timelineDataLoading}
      timelineDataReload={timelineDataReload}
      onAuditDataLoadMore={handleAuditDataLoadMore}
      showLoadMore={showLoadMore}
      onDataReload={handleDataReload}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      allModulesFetched={allModulesFetched}
    />
  );
};
