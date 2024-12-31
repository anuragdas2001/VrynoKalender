import React, { useContext } from "react";
import { IWidget } from "../../../../../../models/Dashboard";
import { GenericWidgetCard } from "../GenericWidgetCard";
import _ from "lodash";
import { useLazyQuery } from "@apollo/client";
import { GET_WIDGET_DATA } from "../../../../../../graphql/queries/getWidgetData";
import { PieChartGraph } from "../../WidgetDashboard/GraphComponents/PieChartGraph/PieChartGraph";
import { capitalCase } from "change-case";
import { WidgetNoData } from "../../../../../../components/Widgets/WidgetNoData";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import { ValueFieldListType } from "../../WidgetDashboard/ConnectedWidgetDashbaord";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { IUserPreference } from "../../../../../../models/shared";

export type GenericCustomBarWidgetProps = {
  widgetData: IWidget;
  moduleName?: string | null;
  timezone: string;
  userPreferences: IUserPreference[];
  showPagination: boolean;
  showPageChanger: boolean;
  showPageCount?: boolean;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
};

export const GenericCustomPieWidget = ({
  widgetData,
  moduleName,
  timezone,
  userPreferences,
  showPageChanger,
  showPagination,
  showPageCount,
  handleWidgetViewOnPreference,
}: GenericCustomBarWidgetProps) => {
  const [graphData, setGraphData] = React.useState<any[]>([]);
  const [valueFieldList, setValueFieldList] = React.useState<
    ValueFieldListType[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;

  const [fetchWidgetData] = useLazyQuery(GET_WIDGET_DATA, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion &&
        responseOnCompletion?.getWidgetData?.code === 200
      ) {
        setGraphData(responseOnCompletion?.getWidgetData?.data?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  React.useEffect(() => {
    if (widgetData) {
      const handleDataFetch = async () => {
        fetchWidgetData({
          variables: {
            id: widgetData?.id,
          },
        });
      };
      handleDataFetch();
      if (widgetData?.widgetMetadata) {
        setValueFieldList(
          _.get(widgetData?.widgetMetadata?.mapping, "valueFieldList", [])
        );
      }
    }
  }, [widgetData]);

  const getGraphTotal = (
    graphData: any[] = [],
    fieldsList: ValueFieldListType[] = []
  ) => {
    let totalRecords = 0;
    graphData.forEach((data) => {
      totalRecords += _.get(data, "recordCount", 0);
    });
    return totalRecords;
  };

  const handleGraphData = (
    graphData: any[],
    fieldsList: ValueFieldListType[]
  ) => {
    let userUpdated: any = {
      ...user,
      timezone: user?.timezone ? user.timezone : timezone,
    };
    let updatedGraphData: any[] = _.cloneDeep(
      graphData.map((data) => {
        let updatedGraphObject: Record<string, string | number> = {};
        Object.keys(data)?.forEach((key) => {
          updatedGraphObject[
            key &&
            String(key).match(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/
            )
              ? getDateAndTime(
                  String(key),
                  userUpdated ? userUpdated : undefined
                )
              : key
          ] =
            data[key] &&
            String(data[key])?.match(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/
            )
              ? getDateAndTime(
                  String(data[key]),
                  userUpdated ? userUpdated : undefined
                )
              : data[key];
        });
        return updatedGraphObject;
      })
    );
    fieldsList?.forEach((field) => {
      if (
        field.operationType === "countPercentage" ||
        field.operationType === "sumPercentage"
      ) {
        let totalValue = 0;
        graphData?.forEach(
          (data) =>
            (totalValue +=
              data[
                `${field.operationType}${capitalCase(
                  field.fieldName
                ).replaceAll(" ", "")}`
              ])
        );
        updatedGraphData = [
          ...updatedGraphData?.map((data) => {
            return {
              ...data,
              [`${field.operationType}${capitalCase(field.fieldName).replaceAll(
                " ",
                ""
              )}`]: _.toNumber(
                (
                  (data[
                    `${field.operationType}${capitalCase(
                      field.fieldName
                    ).replaceAll(" ", "")}`
                  ] *
                    100) /
                  (typeof totalValue === "number" && totalValue !== 0
                    ? totalValue
                    : 1)
                ).toFixed(2)
              ),
            };
          }),
        ];
      }
    });
    return updatedGraphData;
  };

  return (
    <GenericWidgetCard
      widgetName={widgetData?.name}
      widgetId={widgetData?.id}
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
      showFilterBar={false}
      userPreferences={userPreferences}
      infoArray={[
        ...valueFieldList?.map((valueField) => {
          return {
            label: valueField.label,
            value: `Pie chart graph which shows ${
              valueField.operationType === "countAbsolute"
                ? "count"
                : "count percentage"
            } of different ${valueField.label}`,
          };
        }),
      ]}
      totalRecords={getGraphTotal(graphData, valueFieldList)}
      showPageChanger={showPageChanger}
      showPageCount={showPageCount}
      showPagination={showPagination}
      currentPageItemCount={getGraphTotal(graphData, valueFieldList)}
      currentPageNumber={1}
      pageSize={getGraphTotal(graphData, valueFieldList)}
    >
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading color="Blue" height={6} width={6} />
        </div>
      ) : graphData?.length > 0 && valueFieldList?.length > 0 ? (
        <PieChartGraph
          data={
            graphData?.length > 0 && valueFieldList?.length > 0
              ? handleGraphData(graphData, valueFieldList)?.map((data) => {
                  return {
                    name: data[valueFieldList[0]?.fieldName],
                    value:
                      data[
                        `${valueFieldList[0]?.operationType}${capitalCase(
                          valueFieldList[0]?.fieldName
                        ).replaceAll(" ", "")}`
                      ],
                  };
                })
              : []
          }
          outerRadius={70}
          innerRadius={35}
          legendWidth={100}
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
};
