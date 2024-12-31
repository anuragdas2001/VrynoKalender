import moment from "moment";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import {
  pastAndFutureDict,
  pastAndFutureDictMetadata,
} from "./customFilterHelper";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";

const customViewFilterMaker = (
  fieldName: string,
  operatorValue: string,
  logicalOperator: string,
  fieldValue: any
) => {
  return {
    name: fieldName !== "" ? fieldName : null,
    operator: operatorValue,
    value: [...fieldValue],
    logicalOperator: logicalOperator ? logicalOperator : null,
  };
};

const filterValueGenerator = (
  dataType: SupportedDataTypes,
  fieldValue: any,
  operatorValue: string,
  timezone?: string
) => {
  return dataType === "datetime" && fieldValue
    ? fieldValue === "any_value"
      ? ["any_value"]
      : Array.isArray(fieldValue)
      ? fieldValue.map((value: string) =>
          timezone
            ? getCorrectTimezone(value, timezone)
            : moment(value).toISOString()
        )
      : timezone
      ? [getCorrectTimezone(fieldValue, timezone)]
      : [moment(fieldValue).toISOString()]
    : dataType === "date" && fieldValue
    ? fieldValue === "any_value"
      ? ["any_value"]
      : Array.isArray(fieldValue)
      ? fieldValue.map((value: string) => moment(value).format("YYYY-MM-DD"))
      : [moment(fieldValue).format("YYYY-MM-DD")]
    : dataType === "multiSelectLookup" || dataType === "multiSelectRecordLookup"
    ? ["ilike", "stwth", "endwth"].includes(operatorValue)
      ? [fieldValue]
      : fieldValue ?? []
    : dataType === "uuidArray"
    ? fieldValue
    : Array.isArray(fieldValue)
    ? fieldValue
    : fieldValue !== ""
    ? [fieldValue]
    : [];
};

function dataValueFilterMapper(fieldName: string, logicalOperator: string) {
  const requestArray: [any, string, string] = [
    fieldName,
    "between",
    logicalOperator,
  ];
  return {
    today: customViewFilterMaker(...requestArray, [
      "${todayBegin}",
      "${todayEnd}",
    ]),
    yesterday: customViewFilterMaker(...requestArray, [
      "${yesterdayBegin}",
      "${yesterdayEnd}",
    ]),
    "till yesterday": customViewFilterMaker(...requestArray, [
      "${past1000Years}",
      "${yesterdayEnd}",
    ]),
    tomorrow: customViewFilterMaker(...requestArray, [
      "${tomorrowBegin}",
      "${tomorrowEnd}",
    ]),
    "starting tomorrow": customViewFilterMaker(...requestArray, [
      "${tomorrowBegin}",
      "${future1000Years}",
    ]),
    "this week": customViewFilterMaker(...requestArray, [
      "${thisWeekBegin}",
      "${thisWeekEnd}",
    ]),
    "last week": customViewFilterMaker(...requestArray, [
      "${lastWeekBegin}",
      "${lastWeekEnd}",
    ]),
    "next week": customViewFilterMaker(...requestArray, [
      "${nextWeekBegin}",
      "${nextWeekEnd}",
    ]),
    "this month": customViewFilterMaker(...requestArray, [
      "${thisMonthBegin}",
      "${thisMonthEnd}",
    ]),
    "last month": customViewFilterMaker(...requestArray, [
      "${lastMonthBegin}",
      "${lastMonthEnd}",
    ]),
    "next month": customViewFilterMaker(...requestArray, [
      "${nextMonthBegin}",
      "${nextMonthEnd}",
    ]),
    "this year": customViewFilterMaker(...requestArray, [
      "${thisYearBegin}",
      "${thisYearEnd}",
    ]),
    "last year": customViewFilterMaker(...requestArray, [
      "${lastYearBegin}",
      "${lastYearEnd}",
    ]),
    "next year": customViewFilterMaker(...requestArray, [
      "${nextYearBegin}",
      "${nextYearEnd}",
    ]),
  };
}

export const customViewValueGenerator = (
  fieldName: string,
  operatorValue: string,
  fieldValue: any,
  logicalOperator: string,
  dataType: SupportedDataTypes,
  timezone?: string
) => {
  let updatedFilter: {
    name: string | null;
    operator: string | null;
    value: any | null;
    logicalOperator: string | null;
    metadata?: any;
  };
  if (
    !operatorValue ||
    (operatorValue === "between" && fieldValue == null) ||
    fieldName === "" ||
    fieldValue === "" ||
    (Array.isArray(fieldValue) && fieldValue[0] === null) ||
    (Array.isArray(fieldValue) && fieldValue[0] === "") ||
    !operatorValue
  ) {
    return {
      name: fieldName,
      operator: null,
      value: fieldValue,
      logicalOperator: logicalOperator,
    };
  } else if (
    (fieldName === "" ||
      fieldValue === "" ||
      (Array.isArray(fieldValue) && fieldValue[0] === null) ||
      (Array.isArray(fieldValue) && fieldValue[0] === "") ||
      !operatorValue) &&
    !(
      fieldName === "" &&
      (fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue[0] === null) ||
        (Array.isArray(fieldValue) && fieldValue[0] === "")) &&
      !operatorValue
    )
  ) {
    return {
      name: fieldName,
      operator: null,
      value: fieldValue,
      logicalOperator: logicalOperator,
    };
  }

  if (operatorValue.includes("pt_") || operatorValue.includes("ft_")) {
    let updatedFieldValue = parseInt(fieldValue);
    if (isNaN(fieldValue)) {
      updatedFieldValue = fieldValue;
      console.error(
        `Error in filter value. Cannot convert ${fieldValue} of ${fieldName} to number`
      );
    }
    updatedFilter = {
      name: fieldName !== "" ? fieldName : null,
      logicalOperator: logicalOperator ? logicalOperator : null,
      operator: operatorValue ? "between" : null,
      // @ts-ignore
      value: pastAndFutureDict(updatedFieldValue)[operatorValue],
      // @ts-ignore
      metadata: pastAndFutureDictMetadata(updatedFieldValue)[operatorValue],
    };
  } else if (
    (fieldValue === "empty" ||
      (Array.isArray(fieldValue) && fieldValue[0] === "empty")) &&
    operatorValue.includes("is_")
  ) {
    updatedFilter = customViewFilterMaker(
      fieldName,
      operatorValue as string,
      logicalOperator,
      ["${empty}"]
    );
  } else if (operatorValue.includes("d_")) {
    // @ts-ignore
    updatedFilter = dataValueFilterMapper(fieldName, logicalOperator)[
      fieldValue
    ];
  } else {
    const valueExtractedData = filterValueGenerator(
      dataType,
      fieldValue,
      operatorValue,
      timezone
    );

    let valuesProcessedData = valueExtractedData;
    if (operatorValue === "ilike" && Array.isArray(valueExtractedData)) {
      valuesProcessedData = valueExtractedData?.map((val) => `%${val}%`);
    }
    if (operatorValue === "stwth" && Array.isArray(valueExtractedData)) {
      valuesProcessedData = valueExtractedData?.map((val) => `${val}%`);
    }
    if (operatorValue === "endwth" && Array.isArray(valueExtractedData)) {
      valuesProcessedData = valueExtractedData?.map((val) => `%${val}`);
    }
    updatedFilter = {
      name: fieldName !== "" ? fieldName : null,
      operator: operatorValue
        ? ["stwth", "endwth"].includes(operatorValue as string)
          ? "ilike"
          : operatorValue
        : null,
      value: valuesProcessedData,
      logicalOperator: logicalOperator ? logicalOperator : null,
    };
  }
  return updatedFilter;
};
