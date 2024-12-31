import _, { toInteger } from "lodash";

export const calculateModuleDataForPieChart = (
  moduleData: any[],
  fieldName: string,
  operationType: string
) => {
  let pieChartData: Record<string, number> = {};

  moduleData?.forEach((data) => {
    pieChartData[`${data[fieldName]}`] =
      _.get(pieChartData, `${data[fieldName]}`, 0) + 1;
  });
  if (operationType === "countPercentage") {
    let totalValue: number = 0;
    Object.keys(pieChartData)?.forEach(
      (key) => (totalValue += pieChartData[key])
    );
    return Object.keys(pieChartData)?.map((key: string) => {
      return {
        name: key,
        value: _.toNumber(((pieChartData[key] / totalValue) * 100).toFixed(2)),
      };
    });
  }
  return Object.keys(pieChartData)?.map((key) => {
    return { name: key, value: pieChartData[key] };
  });
};
