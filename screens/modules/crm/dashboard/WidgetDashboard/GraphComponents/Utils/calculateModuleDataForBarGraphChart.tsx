import _, { toInteger } from "lodash";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../../models/ICustomField";

export const calculateModuleDataForBarGraphChart = (
  moduleData: any[],
  fieldsList: ICustomField[],
  valueAgainstFieldList: {
    fieldName: string;
    label: string;
    dataType: SupportedDataTypes | null;
  }[],
  valueFieldList: {
    fieldName: any;
    operationType: any;
    label: string;
    dataType: SupportedDataTypes | null;
  }[]
) => {
  if (
    valueAgainstFieldList?.length <= 0 ||
    valueFieldList?.length <= 0 ||
    valueAgainstFieldList?.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length === 0 ||
    valueFieldList.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length === 0
  ) {
    return [];
  }
  if (
    valueAgainstFieldList?.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length === 1 &&
    valueFieldList.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length >= 1
  ) {
    let barGraphChartData: Record<string, Record<string, string | number>> = {};
    let moduleDataMoldedForBarGraph: Record<string, string | number>[] = [];

    moduleData?.forEach((data) => {
      valueAgainstFieldList?.map((field, index) => {
        if (index === 0) {
          barGraphChartData[data[field.fieldName]] = {
            name: data[field.fieldName],
            ...barGraphChartData[data[field.fieldName]],
          };
        } else {
          barGraphChartData[data[valueAgainstFieldList[0].fieldName]] = {
            [field.label]: data[field.fieldName],
            ...barGraphChartData[data[valueAgainstFieldList[0].fieldName]],
          };
        }
      });

      valueFieldList?.forEach((field, index) => {
        if (field.operationType && field.operationType.includes("count")) {
          if (
            field.dataType ||
            (field.fieldName === "all" && field.dataType === null)
          ) {
            barGraphChartData[data[valueAgainstFieldList[0].fieldName]] = {
              ...barGraphChartData[data[valueAgainstFieldList[0].fieldName]],
              [field.label]:
                _.toInteger(
                  _.get(
                    barGraphChartData[data[valueAgainstFieldList[0].fieldName]],
                    field.label,
                    0
                  )
                ) + 1,
            };
          }
        }

        if (field.operationType && field.operationType.includes("sum")) {
          if (field.dataType) {
            barGraphChartData[data[valueAgainstFieldList[0].fieldName]] = {
              ...barGraphChartData[data[valueAgainstFieldList[0].fieldName]],
              [field.label]:
                _.get(
                  barGraphChartData[data[valueAgainstFieldList[0].fieldName]],
                  field.label,
                  0
                ) + _.get(data, field.fieldName, 0),
            };
          }
        }
      });
    });

    for (let key in barGraphChartData) {
      moduleDataMoldedForBarGraph.push(barGraphChartData[key]);
    }

    valueFieldList?.forEach((field) => {
      if (
        field.operationType &&
        (field.operationType === "sumPercentage" ||
          field.operationType === "countPercentage")
      ) {
        let totalOfFieldValue: number = 0;
        moduleDataMoldedForBarGraph.forEach(
          (dataSet) =>
            (totalOfFieldValue += _.toNumber(
              _.get(dataSet, _.get(field, "label", ""), 0)
            ))
        );
        moduleDataMoldedForBarGraph = moduleDataMoldedForBarGraph.map(
          (dataSet: any) => {
            return {
              ...dataSet,
              [_.get(field, "label", "")]: _.toNumber(
                (
                  (_.get(dataSet, _.get(field, "label", ""), 0) * 100) /
                  totalOfFieldValue
                ).toFixed(2)
              ),
            };
          }
        );
      }
    });

    return moduleDataMoldedForBarGraph;
  }

  if (
    valueAgainstFieldList?.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length > 1 &&
    valueFieldList.filter(
      (field) => field.fieldName && field.fieldName !== "null"
    )?.length === 1
  ) {
    let barGraphChartData: Record<string, any> = {};
    let moduleDataMoldedForBarGraph: Record<string, string | number>[] = [];

    moduleData?.forEach((data) => {
      valueAgainstFieldList?.forEach((field, index) => {
        if (index === 0) {
          barGraphChartData[data[field.fieldName]] = {
            name: data[field.fieldName],
            ...barGraphChartData[data[field.fieldName]],
          };
        }
      });
    });

    for (let key in barGraphChartData) {
      valueAgainstFieldList?.forEach((field, index) => {
        if (index !== 0) {
          moduleData?.forEach((data, index) => {
            if (data[valueAgainstFieldList[0].fieldName] === key) {
              barGraphChartData[key][field.fieldName] = barGraphChartData[key][
                field.fieldName
              ]
                ? [
                    ...barGraphChartData[key][field.fieldName],
                    data[field.fieldName],
                  ]
                : [data[field.fieldName]];
            }
          });
        }
      });
    }

    valueFieldList?.forEach((field) => {
      if (
        field.operationType &&
        (field.operationType === "sumPercentage" ||
          field.operationType === "countPercentage")
      ) {
        let totalOfFieldValue: number = 0;
        moduleDataMoldedForBarGraph.forEach(
          (dataSet) =>
            (totalOfFieldValue += _.toNumber(
              _.get(dataSet, _.get(field, "label", ""), 0)
            ))
        );
        moduleDataMoldedForBarGraph = moduleDataMoldedForBarGraph.map(
          (dataSet: any) => {
            return {
              ...dataSet,
              [_.get(field, "label", "")]: _.toNumber(
                (
                  (_.get(dataSet, _.get(field, "label", ""), 0) * 100) /
                  totalOfFieldValue
                ).toFixed(2)
              ),
            };
          }
        );
      }
    });
    return moduleDataMoldedForBarGraph;
  }
  return [];
};
