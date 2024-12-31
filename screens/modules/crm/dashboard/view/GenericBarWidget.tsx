import _, { get } from "lodash";
import React from "react";
import { WidgetNoData } from "../../../../../components/Widgets/WidgetNoData";
import { GenericWidgetCard } from "./GenericWidgetCard";
import { BarGraphChart } from "../WidgetDashboard/GraphComponents/LineBarChartGraph/BarGraphChart";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../models/shared";

export const BAR_COLORS = [
  "#1A374D",
  "#406882",
  "#6998AB",
  "#B1D0E0",
  "#4B3869",
  "#FF7E67",
  "#406882",
  "#1C0C5B",
  "#664E88",
  "#B1D0E0",
  "#4B3869",
  "#3D2C8D",
  "#F0D9FF",
  "#39A2DB",
  "#A2DBFA",
  "#A7BBC7",
  "#DA7F8F",
  "#92967D",
];

export default function GenericBarWidget({
  widgetName,
  widgetId,
  dealForecastData,
  userPreferences,
  showPageChanger,
  showPagination,
  showPageCount,
  handleWidgetViewOnPreference,
}: {
  widgetName: string;
  widgetId: string;
  userPreferences: IUserPreference[];
  dealForecastData: BaseGenericObjectType[];
  showPagination: boolean;
  showPageChanger: boolean;
  showPageCount?: boolean;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) {
  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [currentPipeline, setCurrentPipeline] = React.useState<string>();
  const [currentPipelineData, setCurrentPipelineData] = React.useState<
    Record<string, string | Record<string, string | number>> | undefined
  >();

  React.useEffect(() => {
    if (dealForecastData && dealForecastData.length > 0) {
      const defaultPipeline = dealForecastData?.filter(
        (item: BaseGenericObjectType) => item.default
      );
      setCurrentPipeline(
        defaultPipeline?.length > 0
          ? defaultPipeline[0].name
          : dealForecastData[0].name
      );
    }
  }, [dealForecastData]);

  React.useEffect(() => {
    if (dealForecastData && currentPipeline) {
      let currentPipelineRecord = dealForecastData?.filter(
        (item: Partial<{ name: string }>) => item.name === currentPipeline
      );
      setCurrentPipelineData(
        currentPipelineRecord?.length > 0 ? currentPipelineRecord[0] : undefined
      );
    }
  }, [dealForecastData, currentPipeline]);

  const handleObject = (
    item: Record<string, string | Record<string, string | number>> | undefined
  ) => {
    let barObject: { name: string; ExpectedRevenue: number }[] = [];
    for (const property in item) {
      if (property !== "name") {
        let expectedRevenue = get(item[property], "expectedRevenue", 0);
        if (typeof expectedRevenue === "number" && property !== "default") {
          barObject = [
            ...barObject,
            { ExpectedRevenue: expectedRevenue, name: property },
          ];
        }
      }
    }
    return barObject;
  };

  React.useEffect(() => {
    if (currentPipelineData && Object.keys(currentPipelineData)?.length > 0) {
      let totalRecords = 0;
      Object.keys(currentPipelineData)?.forEach(
        (key) =>
          (totalRecords += _.get(
            currentPipelineData[key] as Record<string, number>,
            "count",
            0
          ))
      );
      setTotalRecords(totalRecords);
    }
  }, [currentPipelineData]);

  return (
    <GenericWidgetCard
      widgetName={widgetName}
      widgetId={widgetId}
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
      showFilterBar={true}
      totalRecords={totalRecords}
      infoArray={[
        {
          label: "",
          value:
            "Bar Graph data showing different deal pipelines each with their own stages showing the actual amount for that stage captured without probability",
        },
      ]}
      externalFilterBar={dealForecastData?.map(
        (deal: BaseGenericObjectType) => {
          return { label: deal.name, value: deal.name };
        }
      )}
      filterIsActive={currentPipeline}
      setFilterIsActive={(value) => setCurrentPipeline(value)}
      handleFilterSelection={(value) => console.log(value)}
      userPreferences={userPreferences}
      showPageChanger={showPageChanger}
      showPagination={showPagination}
      showPageCount={showPageCount}
      currentPageItemCount={totalRecords}
      currentPageNumber={1}
      pageSize={totalRecords}
    >
      {dealForecastData && dealForecastData?.length > 0 ? (
        <div className={"max-w-[95%] mt-4"}>
          <BarGraphChart
            data={handleObject(currentPipelineData)}
            allowDataManipulation={false}
          />
        </div>
      ) : (
        <div className="w-full h-full p-4 pb-15">
          <div className={`w-full h-full pr-6`}>
            <div className={`w-full h-full flex justify-center items-center`}>
              <WidgetNoData />
            </div>
          </div>
        </div>
      )}
    </GenericWidgetCard>
  );
}
