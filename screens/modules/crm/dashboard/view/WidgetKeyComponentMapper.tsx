import React from "react";
import { IWidget } from "../../../../../models/Dashboard";
import GenericTableWidget from "./GenericTableWidget";
import GenericPieWidget from "./GenericPieWidget";
import GenericBarWidget from "./GenericBarWidget";
import GenericLineGraphWidget from "./GenericLineGraphWidget";
import GenericPipelineWidget from "./GenericPipelineWidget";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import { WidgetNoData } from "../../../../../components/Widgets/WidgetNoData";
import { GenericWidgetCard } from "./GenericWidgetCard";
import { WidgetNoFieldPermission } from "../../../../../components/Widgets/WidgetNoFieldPermission";
import { GenericCustomPieWidget } from "./CustomWidgetGraphs/GenericCustomPieWidget";
import { GenericCustomLineBarWidget } from "./CustomWidgetGraphs/GenericCustomBarLineWidget";
import _ from "lodash";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";

export const WidgetKeyComponentMapper = ({
  data,
  widgetFilterDataLoading,
  timezone,
  genericModels,
  allLayoutFetched,
  userPreferences,
  user,
  handleFilterSelection = () => {},
  handleWidgetViewOnPreference,
}: {
  data: IWidget | undefined;
  widgetFilterDataLoading: boolean;
  timezone: string;
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  handleFilterSelection?: (
    value: "null" | "day" | "week" | "month" | "year",
    pageNumber?: number
  ) => void;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) => {
  if (data?.fieldPermissionMessage) {
    return (
      <GenericWidgetCard
        widgetName={data?.name || "Unknown Widget"}
        showCardInfo={false}
        showFilterBar={false}
        widgetId={data.id}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={false}
        showPageChanger={false}
        currentPageItemCount={0}
        currentPageNumber={1}
      >
        <div className="w-full h-full p-4 pb-15">
          <div
            className={`w-full h-full overflow-scroll sm:overflow-hidden sm:hover:overflow-scroll pb-2`}
          >
            <WidgetNoFieldPermission message={data?.fieldPermissionMessage} />
          </div>
        </div>
      </GenericWidgetCard>
    );
  } else if (data?.widgetType === "table") {
    return (
      <GenericTableWidget
        widgetName={data.name}
        widgetFilterDataLoading={widgetFilterDataLoading}
        widgetHeaders={
          data?.customView?.length > 0 ? data?.customView[0]?.moduleFields : ""
        }
        data={
          data?.customView?.length > 0
            ? data?.customView[0]?.customViewData &&
              getDataObjectArray(data?.customView[0]?.customViewData)
            : []
        }
        totalRecords={
          data?.customView?.length > 0 ? data?.customView[0]?.count : 0
        }
        moduleName={
          data?.customView?.length > 0
            ? data?.customView[0]?.moduleName
            : data?.widgetMetadata?.moduleName ?? ""
        }
        handleFilterSelection={(filter, pageNumber) =>
          handleFilterSelection(filter, pageNumber)
        }
        showFilterBar={true}
        widgetId={data.id}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
      />
    );
  } else if (
    data?.widgetType === "graph" &&
    data?.widgetMetadata?.widgetType === "pieChartGraph"
  ) {
    return (
      <GenericCustomPieWidget
        widgetData={data}
        timezone={timezone}
        userPreferences={userPreferences}
        moduleName={_.get(data?.widgetMetadata, "moduleName", null)}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={true}
        showPageChanger={false}
        showPageCount={false}
      />
    );
  } else if (
    data?.widgetType === "graph" &&
    ["lineGraph", "barGraph"].includes(data?.widgetMetadata?.widgetType)
  ) {
    return (
      <GenericCustomLineBarWidget
        widgetData={data}
        timezone={timezone}
        moduleName={_.get(data?.widgetMetadata, "moduleName", null)}
        widgetType={data?.widgetMetadata?.widgetType}
        user={user}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={true}
        showPageChanger={false}
        showPageCount={false}
      />
    );
  } else if (data?.key === "deal-pipeline") {
    return (
      <GenericPipelineWidget
        widgetName={data.name}
        data={
          data?.customView?.length > 0 ? data?.customView[0]?.graphData : []
        }
      />
    );
  } else if (data?.key === "revenue-via-closed-deals") {
    return (
      <GenericLineGraphWidget
        widgetName={data.name}
        data={data?.customView}
        widgetId={data.id}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={true}
        showPageChanger={false}
        showPageCount={false}
      />
    );
  } else if (data?.key === "lead-by-source") {
    return (
      <GenericPieWidget
        widgetName={data.name}
        data={
          data?.customView?.length > 0 ? data?.customView[0]?.graphData : []
        }
        widgetId={data.id}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={true}
        showPageChanger={false}
        showPageCount={false}
      />
    );
  } else if (data?.key === "deal-forecast") {
    return (
      <GenericBarWidget
        widgetName={data.name}
        dealForecastData={
          data?.customView?.length > 0 ? data?.customView[0]?.graphData : []
        }
        widgetId={data.id}
        userPreferences={userPreferences}
        handleWidgetViewOnPreference={handleWidgetViewOnPreference}
        showPagination={true}
        showPageChanger={false}
        showPageCount={false}
      />
    );
  }
  return (
    <GenericWidgetCard
      widgetName={"Unknown Widget"}
      showCardInfo={false}
      showFilterBar={false}
      widgetId={""}
      userPreferences={userPreferences}
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
      showPagination={false}
      showPageChanger={false}
      currentPageItemCount={0}
      currentPageNumber={1}
    >
      <div className="w-full h-full p-4 pb-15">
        <div
          className={`w-full h-full overflow-scroll sm:overflow-hidden sm:hover:overflow-scroll pb-2`}
        >
          <WidgetNoData />
        </div>
      </div>
    </GenericWidgetCard>
  );
};
