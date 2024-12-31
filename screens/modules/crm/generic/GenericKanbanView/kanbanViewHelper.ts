import { ICustomField } from "../../../../../models/ICustomField";
import { IndexExpressionMapper } from "../GenericAddCustomView/customViewHelpers/customViewShared";

export const selectedFieldFinder = (
  fieldsList: ICustomField[],
  categorizeBy: string
) => {
  let selectedField: ICustomField | null = null;
  for (let i = 0; i < fieldsList.length; i++) {
    if (fieldsList[i].systemDefined) {
      if (fieldsList[i].name === categorizeBy) {
        selectedField = fieldsList[i];
        break;
      }
    } else {
      if (`fields.${fieldsList[i].name}` === categorizeBy) {
        selectedField = fieldsList[i];
        break;
      }
    }
  }
  return selectedField;
};

export const expressionGenerator = (
  filter: any[],
  customViewFilterLength: number
) => {
  let expressionPattern = "";
  filter.forEach(() => (expressionPattern += "( "));
  filter.forEach(
    (
      item: {
        name: string;
        operator: string;
        value: any[];
        logicalOperator: string;
      },
      index: number,
      filter: any[]
    ) => {
      expressionPattern += `${
        index === 0 && item[`logicalOperator`]?.split(",")[0] === "NOT"
          ? "not "
          : ""
      }${IndexExpressionMapper[index + 1]} )${
        filter[index + 1] && filter[index + 1]["operator"]
          ? ` ${
              customViewFilterLength === 1
                ? "and"
                : index === 0 &&
                  item["logicalOperator"]?.split(",")?.length === 2
                ? item["logicalOperator"]?.split(",")?.[1]?.toLowerCase()
                : index === filter.length - 2
                ? "and"
                : String(item["logicalOperator"]).toLowerCase()
            }`
          : ""
      } `;
    }
  );
  return expressionPattern;
};
