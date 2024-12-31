import _ from "lodash";
import { ISimplifiedCustomField } from "../../../shared/utils/getOrderedFieldsList";
import { fieldNameExtractor } from "./customFilterHelper";

export const customViewInitialDataDataGenerator = (
  filterData: any[],
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string
) => {
  let fieldInitialData = {};
  for (let i = 0; i < filterData.length; i++) {
    for (const key in filterData[i]) {
      let fieldName = filterData[i].name;
      if (fieldName.includes("fields.")) {
        fieldName = fieldName.split(".")[1];
      }
      const fieldDataType = processedFieldList.filter((field) => {
        if (field.value === fieldName) return field;
      });
      if (
        key.includes("value") &&
        fieldDataType &&
        fieldDataType.length > 0 &&
        (fieldDataType[0].dataType === "multiSelectRecordLookup" ||
          fieldDataType[0].dataType === "multiSelectLookup" ||
          fieldDataType[0].dataType === "uuidArray")
      ) {
        fieldInitialData = {
          ...fieldInitialData,
          [`${key}${uniqueCustomName}${i}`]: filterData[i][key],
        };
      } else if (key.includes("value")) {
        if (filterData[i].operator === "between") {
          fieldInitialData = {
            ...fieldInitialData,
            [`${key}${uniqueCustomName}${i}-between-start`]:
              filterData[i][key][0],
            [`${key}${uniqueCustomName}${i}-between-end`]:
              filterData[i][key][1],
          };
        } else {
          fieldInitialData = {
            ...fieldInitialData,
            [`${key}${uniqueCustomName}${i}`]: filterData[i][key][0],
          };
        }
      } else if (key.includes("logicalOperator")) {
        const logicalOperatorData = filterData[i][key]?.split(",");
        if (logicalOperatorData) {
          if (logicalOperatorData == null) continue;
          if (logicalOperatorData?.length == 2) {
            fieldInitialData = {
              ...fieldInitialData,
              [`logicalOperatorNot${uniqueCustomName}`]: logicalOperatorData[0],
              [`${key}${uniqueCustomName}${i}`]:
                logicalOperatorData[1] !== "null" ? logicalOperatorData[1] : "",
            };
          } else {
            fieldInitialData = {
              ...fieldInitialData,
              [`${key}${uniqueCustomName}${i}`]: logicalOperatorData[0],
            };
          }
        }
      } else if (!key.includes("value") && !key.includes("logicalOperator")) {
        if (
          fieldDataType &&
          fieldDataType?.length > 0 &&
          (fieldDataType[0].dataType === "multiSelectLookup" ||
            fieldDataType[0].dataType === "multiSelectRecordLookup") &&
          (_.get(fieldDataType[0].dataTypeMetadata, "type", "") === "string" ||
            _.get(fieldDataType[0].dataTypeMetadata, "type", "") === "lookup" ||
            _.get(fieldDataType[0].dataTypeMetadata, "type", "") ===
              "record") &&
          key === "operator" &&
          filterData[i][key] === "eq"
        ) {
          fieldInitialData = {
            ...fieldInitialData,
            [`${key}${uniqueCustomName}${i}`]: "in",
          };
        } else {
          fieldInitialData = {
            ...fieldInitialData,
            [`${key}${uniqueCustomName}${i}`]: filterData[i][key],
          };
        }
      }
    }
  }
  return fieldInitialData;
};

export const customViewFilterDataGenerator = (
  filterData: any[],
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string
) => {
  return filterData.map(
    (
      val: {
        name: any;
        operator: any;
        value: any;
        logicalOperator: any;
      },
      index: number
    ) => {
      let fieldName = val.name;
      if (fieldName.split(".")[0] === "fields") {
        fieldName = fieldNameExtractor(fieldName);
      }
      const fieldDataType = processedFieldList?.filter((field) => {
        if (field.value === fieldName) return field;
      });

      let data = {};
      const logicalOperator = val.logicalOperator
        ? val.logicalOperator.split(",")
        : [""];
      const checkMutatedSingleLookupsOperatorIsEq =
        fieldDataType &&
        fieldDataType?.length > 0 &&
        (fieldDataType[0].dataType === "multiSelectLookup" ||
          fieldDataType[0].dataType === "multiSelectRecordLookup") &&
        (_.get(fieldDataType[0].dataTypeMetadata, "type", "") === "string" ||
          _.get(fieldDataType[0].dataTypeMetadata, "type", "") === "lookup" ||
          _.get(fieldDataType[0].dataTypeMetadata, "type", "") === "record") &&
        val.operator === "eq";
      if (logicalOperator.length === 2) {
        data = {
          [`fieldName${uniqueCustomName}`]: fieldNameExtractor(val.name),
          [`operator${uniqueCustomName}${index}`]:
            checkMutatedSingleLookupsOperatorIsEq
              ? "in"
              : val.operator
              ? val.operator
              : "",
          [`logicalOperator${uniqueCustomName}${index}`]:
            logicalOperator[1] !== "null" ? logicalOperator[1] : "",
          [`value${uniqueCustomName}`]: "",
          [`logicalOperatorNot${uniqueCustomName}`]: logicalOperator[0],
        };
      } else {
        data = {
          [`fieldName${uniqueCustomName}`]: fieldNameExtractor(val.name),
          [`operator${uniqueCustomName}${index}`]:
            checkMutatedSingleLookupsOperatorIsEq
              ? "in"
              : val.operator
              ? val.operator
              : "",
          [`logicalOperator${uniqueCustomName}${index}`]:
            val.logicalOperator || "",
          [`value${uniqueCustomName}`]: "",
        };
      }
      return !val.name
        ? data
        : fieldDataType[0].dataType === "multiSelectRecordLookup" ||
          fieldDataType[0].dataType === "multiSelectLookup" ||
          fieldDataType[0].dataType === "uuidArray"
        ? {
            ...data,
            [`value${uniqueCustomName}`]: val.value,
            [val.name]: val.value,
          }
        : {
            ...data,
            [`value${uniqueCustomName}`]:
              val.value.length === 0 ? "" : val?.value?.join(" "),
            [val.name]: val.value.join(" "),
          };
    }
  );
};
