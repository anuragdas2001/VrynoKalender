import React from "react";
import { getDate } from "../../../../../components/TailwindControls/DayCalculator";
import { WidgetNoData } from "../../../../../components/Widgets/WidgetNoData";
import { GenericWidgetCard } from "./GenericWidgetCard";
import { LineGraphChart } from "../WidgetDashboard/GraphComponents/LineBarChartGraph/LineGraphChart";
import _ from "lodash";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../models/shared";

export type GenericLineGraphWidget = {
  data: BaseGenericObjectType[];
  widgetName: string;
  widgetId: string;
  userPreferences: IUserPreference[];
  showPagination: boolean;
  showPageChanger: boolean;
  showPageCount?: boolean;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
};

export default function GenericLineGraphWidget({
  data,
  widgetName,
  widgetId,
  userPreferences,
  showPageChanger,
  showPagination,
  showPageCount,
  handleWidgetViewOnPreference,
}: GenericLineGraphWidget) {
  const [totalRecords, setTotalRecords] = React.useState<number>(0);

  const processedData = () => {
    return (
      data?.map((obj: BaseGenericObjectType) => {
        let updatedObject: Record<string, any> = {
          closedAt: getDate(obj.closedAt),
          amount: obj.amount,
        };
        Object.keys(obj).forEach((key) => {
          if (!["count", "recordCount"].includes(key)) {
            updatedObject[key] = obj[key];
          }
        });
        return { ...updatedObject };
      }) || []
    );
  };

  React.useEffect(() => {
    if (data?.length > 0) {
      let totalRecords = 0;
      data?.forEach((value) => (totalRecords += _.get(value, "count", 0)));
      setTotalRecords(totalRecords);
    }
  }, [data]);

  return (
    <GenericWidgetCard
      widgetName={widgetName}
      widgetId={widgetId}
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
      showFilterBar={false}
      infoArray={[
        {
          label: "",
          value: "Line graph showing amount at which the deal got closed",
        },
      ]}
      totalRecords={totalRecords}
      userPreferences={userPreferences}
      showPageChanger={showPageChanger}
      showPagination={showPagination}
      currentPageItemCount={totalRecords}
      currentPageNumber={1}
      pageSize={totalRecords}
      showPageCount={showPageCount}
    >
      {data && data.length > 0 ? (
        <div className={"max-w-[95%] mt-4"}>
          <LineGraphChart
            data={data && processedData()}
            allowDataManipulation={false}
          />
        </div>
      ) : (
        <div className="w-full h-full p-4 pb-15">
          <div className={`w-full h-full pr-6`}>
            <div className="w-full mb-20" style={{ height: "100%" }}>
              <WidgetNoData />
            </div>
          </div>
        </div>
      )}
    </GenericWidgetCard>
  );
}
