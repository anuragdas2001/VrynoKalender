import React from "react";
import { IWidget } from "../../../../../../models/Dashboard";
import { GenericWidgetCard } from "../GenericWidgetCard";
import _ from "lodash";
import { useLazyQuery } from "@apollo/client";
import { GET_WIDGET_DATA } from "../../../../../../graphql/queries/getWidgetData";
import { capitalCase } from "change-case";
import { BarGraphChart } from "../../WidgetDashboard/GraphComponents/LineBarChartGraph/BarGraphChart";
import { LineGraphChart } from "../../WidgetDashboard/GraphComponents/LineBarChartGraph/LineGraphChart";
import { WidgetNoData } from "../../../../../../components/Widgets/WidgetNoData";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "../../WidgetDashboard/ConnectedWidgetDashbaord";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { User } from "../../../../../../models/Accounts";
import { IUserPreference } from "../../../../../../models/shared";

export type GenericCustomLineBarWidgetProps = {
  widgetData: IWidget;
  widgetType: string;
  timezone: string;
  moduleName?: string | null;
  user: User | null;
  userPreferences: IUserPreference[];
  showPagination: boolean;
  showPageChanger: boolean;
  showPageCount?: boolean;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
};

export const GenericCustomLineBarWidget = ({
  widgetData,
  widgetType,
  timezone,
  user,
  userPreferences,
  moduleName,
  showPageChanger,
  showPagination,
  showPageCount,
  handleWidgetViewOnPreference,
}: GenericCustomLineBarWidgetProps) => {
  const [graphData, setGraphData] = React.useState<any[]>([]);
  const [valueFieldList, setValueFieldList] = React.useState<
    ValueFieldListType[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [valueAgainstFieldList, setValueAgainstFieldList] = React.useState<
    ValueAgainstFieldListType[]
  >([]);

  const [fetchWidgetData] = useLazyQuery(GET_WIDGET_DATA, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  React.useEffect(() => {
    if (widgetData) {
      const handleDataFetch = async () => {
        await fetchWidgetData({
          variables: {
            id: widgetData?.id,
          },
        }).then((responseOnCompletion) => {
          if (
            responseOnCompletion.data &&
            responseOnCompletion?.data?.getWidgetData?.code === 200
          ) {
            setGraphData(responseOnCompletion?.data?.getWidgetData?.data?.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      };
      if (widgetData?.widgetMetadata) {
        setValueAgainstFieldList(
          _.get(
            widgetData?.widgetMetadata?.mapping,
            "valueAgainstFieldList",
            []
          )
        );
        setValueFieldList(
          _.get(widgetData?.widgetMetadata?.mapping, "valueFieldList", [])
        );
      }
      handleDataFetch();
    }
  }, [widgetData]);

  const getGraphTotal = (
    graphData: any[],
    fieldsList: ValueFieldListType[]
  ) => {
    let totalRecords = 0;
    graphData.forEach((data) => {
      totalRecords += _.get(data, "recordCount", 0);
    });
    return totalRecords;
  };

  const handleGraphData = (
    graphData: any[],
    fieldsList: ValueFieldListType[],
    valueAgainstFieldList: ValueAgainstFieldListType[]
  ) => {
    let userUpdated: any = {
      ...user,
      timezone: user?.timezone ? user.timezone : timezone,
    };
    let updatedGraphData: any[] = _.cloneDeep(
      graphData.map((data) => {
        let updatedGraphObject: Record<string, string | number> = {};
        Object.keys(data)?.forEach((key) => {
          if (!["count", "recordCount"].includes(key)) {
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
          }
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

    return updatedGraphData?.map((data) => {
      let updatedGraphObject: Record<string, string | number> = {};
      if (
        valueAgainstFieldList?.filter(
          (field) => field.fieldName && field.fieldName !== "null"
        )?.length > 1
      ) {
        updatedGraphObject = _.cloneDeep(data);
      } else {
        valueFieldList?.forEach((field, index) => {
          updatedGraphObject[field.label] =
            data[
              `${field?.operationType}${capitalCase(
                field?.fieldName
              ).replaceAll(" ", "")}`
            ];
        });
      }

      valueAgainstFieldList?.forEach((field, index) => {
        if (index === 0) {
          updatedGraphObject["name"] = data[field.fieldName];
          if (field.fieldName !== "name") {
            delete updatedGraphObject[field.fieldName];
          }
        } else {
          updatedGraphObject[field.label] = data[field.fieldName];
        }
      });

      return updatedGraphObject;
    });
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
            value: `${widgetType === "barGraph" ? "Bar" : "Line"} which shows ${
              valueField.operationType === "sumAbsolute"
                ? "sum"
                : valueField.operationType === "sumPercentage"
                ? "sum percentage"
                : valueField.operationType === "countPercentage"
                ? "count percentage"
                : "count"
            } of different ${valueField.label}`,
          };
        }),
      ]}
      totalRecords={getGraphTotal(graphData, valueFieldList)}
      showPageChanger={showPageChanger}
      showPagination={showPagination}
      showPageCount={showPageCount}
      currentPageItemCount={getGraphTotal(graphData, valueFieldList)}
      currentPageNumber={1}
      pageSize={getGraphTotal(graphData, valueFieldList)}
    >
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <Loading color="Blue" height={6} width={6} />
        </div>
      ) : graphData?.length > 0 &&
        valueFieldList?.length > 0 &&
        valueAgainstFieldList?.length > 0 ? (
        <div className={"max-w-[95%] mt-4"}>
          {widgetType === "barGraph" ? (
            <BarGraphChart
              data={
                graphData?.length > 0 &&
                valueFieldList?.length > 0 &&
                valueAgainstFieldList?.length > 0
                  ? handleGraphData(
                      graphData,
                      valueFieldList,
                      valueAgainstFieldList
                    )
                  : []
              }
              allowDataManipulation={false}
              changeGraphToStack={
                valueAgainstFieldList?.filter(
                  (field) => field.fieldName && field.fieldName !== "null"
                )?.length > 1
              }
            />
          ) : (
            <LineGraphChart
              data={
                graphData?.length > 0 &&
                valueFieldList?.length > 0 &&
                valueAgainstFieldList?.length > 0
                  ? handleGraphData(
                      graphData,
                      valueFieldList,
                      valueAgainstFieldList
                    )
                  : []
              }
              allowDataManipulation={false}
            />
          )}
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
};
