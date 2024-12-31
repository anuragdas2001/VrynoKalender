import React from "react";
import { WidgetNoData } from "../../../../../components/Widgets/WidgetNoData";
import { GenericWidgetCard } from "./GenericWidgetCard";
import { PieChartGraph } from "../WidgetDashboard/GraphComponents/PieChartGraph/PieChartGraph";
import _ from "lodash";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../models/shared";

const BAR_COLORS = [
  "#005792",
  "#448EF6",
  "#FDB44B",
  "#FF7E67",
  "#3D2C8D",
  "#1C0C5B",
  "#6998AB",
  "#B1D0E0",
  "#4B3869",
  "#664E88",
  "#F0D9FF",
  "#39A2DB",
  "#A2DBFA",
  "#A7BBC7",
  "#DA7F8F",
  "#92967D",
  "#C8C6A7",
  "#F4ABC4",
  "#7579E7",
  "#E7DFD5",
];

export const renderLegend = (props: BaseGenericObjectType) => {
  const { payload } = props;

  return (
    <ul className="flex flex-col justify-center gap-x-4 pr-4 w-full overflow-y-scroll">
      {payload.map((entry: BaseGenericObjectType, index: number) => (
        <li
          key={`item-${index}`}
          className={`text-xsm flex items-center gap-x-2`}
        >
          <p
            className={`w-3 h-3 rounded-full`}
            style={{ backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }}
          ></p>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default function GenericPieWidget({
  data,
  widgetId,
  widgetName,
  userPreferences,
  showPageChanger,
  showPagination,
  showPageCount,
  handleWidgetViewOnPreference,
}: {
  data: { name: string; value: number }[];
  widgetId: string;
  widgetName: string;
  userPreferences: IUserPreference[];
  showPagination: boolean;
  showPageChanger: boolean;
  showPageCount?: boolean;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) {
  const [totalRecords, setTotalRecords] = React.useState<number>(0);

  const calculatePercentage = (
    value: number,
    data: { name: string; value: number }[]
  ) => {
    let totalItemCount = 0;
    data.map((item) => (totalItemCount += item.value));
    const percentage = (value * 100) / totalItemCount;
    return percentage;
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
      totalRecords={totalRecords}
      infoArray={[
        {
          label: "",
          value:
            "Bar graph which shows count of different sources of lead generation in precentage (%)",
        },
      ]}
      userPreferences={userPreferences}
      showPageChanger={showPageChanger}
      showPagination={showPagination}
      showPageCount={showPageCount}
      currentPageItemCount={totalRecords}
      currentPageNumber={1}
      pageSize={totalRecords}
    >
      {data && data.length > 0 ? (
        <PieChartGraph
          data={data}
          outerRadius={70}
          innerRadius={35}
          legendWidth={100}
          cy={40}
        />
      ) : (
        <div className="w-full h-full p-4 pb-15">
          <div className={`w-full h-full flex justify-center items-center`}>
            <WidgetNoData />
          </div>
        </div>
      )}
    </GenericWidgetCard>
  );
}
