import { toast } from "react-toastify";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import { ISimplifiedCustomField } from "../../../shared/utils/getOrderedFieldsList";
import moment from "moment";
import {
  pastAndFutureDict,
  pastAndFutureDictMetadata,
} from "./customFilterHelper";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";

const customViewFilterMaker = (
  val: any,
  operator: string,
  index: number,
  uniqueCustomName: string,
  value: string[]
) => {
  return {
    name:
      val[`fieldName${uniqueCustomName}`] !== ""
        ? val[`fieldName${uniqueCustomName}`]
        : null,
    operator: operator,
    value: [...value],
    logicalOperator: val[`logicalOperator${uniqueCustomName}${index}`]
      ? val[`logicalOperator${uniqueCustomName}${index}`]
      : null,
  };
};

const filterValueGenerator = (
  fieldValue: ISimplifiedCustomField,
  val: any,
  uniqueCustomName: string,
  index: number,
  timezone?: string
) => {
  return fieldValue.dataType === "datetime" && val[`value${uniqueCustomName}`]
    ? val[`value${uniqueCustomName}`] === "any_value"
      ? ["any_value"]
      : Array.isArray(val[`value${uniqueCustomName}`])
      ? val[`value${uniqueCustomName}`].map((value: string) =>
          timezone
            ? getCorrectTimezone(value, timezone)
            : moment(value).toISOString()
        )
      : timezone
      ? [getCorrectTimezone(val[`value${uniqueCustomName}`], timezone)]
      : [moment(val[`value${uniqueCustomName}`]).toISOString()]
    : fieldValue.dataType === "date" && val[`value${uniqueCustomName}`]
    ? val[`value${uniqueCustomName}`] === "any_value"
      ? ["any_value"]
      : Array.isArray(val[`value${uniqueCustomName}`])
      ? val[`value${uniqueCustomName}`].map((value: string) =>
          moment(value).format("YYYY-MM-DD")
        )
      : [moment(val[`value${uniqueCustomName}`]).format("YYYY-MM-DD")]
    : fieldValue.dataType === "multiSelectLookup" ||
      fieldValue.dataType === "multiSelectRecordLookup"
    ? ["ilike", "stwth", "endwth"].includes(
        val[`operator${uniqueCustomName}${index}`]
      )
      ? [val[`value${uniqueCustomName}`]]
      : val[`value${uniqueCustomName}`] ?? []
    : fieldValue.dataType === "uuidArray"
    ? val[`value${uniqueCustomName}`]
    : Array.isArray(val[`value${uniqueCustomName}`])
    ? val[`value${uniqueCustomName}`]
    : val[`value${uniqueCustomName}`] !== ""
    ? [val[`value${uniqueCustomName}`]]
    : [];
};

function dataValueFilterMapper(
  val: any,
  index: number,
  uniqueCustomName: string
) {
  const requestArray: [any, string, number, string] = [
    val,
    "between",
    index,
    uniqueCustomName,
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

export const customViewFilterGenerator = (
  updatedConditionList: ICriteriaFilterRow[],
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string,
  timezone?: string
) => {
  let filterData: any[] = [];
  let filterCorrect = true;
  if (updatedConditionList[0][`fieldName${uniqueCustomName}`] !== "") {
    for (let index = 0; index < updatedConditionList.length; index++) {
      let val = updatedConditionList[index];
      if (
        !val[`operator${uniqueCustomName}${index}`] ||
        (val[`operator${uniqueCustomName}${index}`] === "between" &&
          val[`value${uniqueCustomName}`] == null) ||
        val[`fieldName${uniqueCustomName}`] === "" ||
        val[`value${uniqueCustomName}`] === "" ||
        !val[`operator${uniqueCustomName}${index}`]
      ) {
        filterCorrect = false;
        break;
      } else if (
        (val[`fieldName${uniqueCustomName}`] === "" ||
          val[`value${uniqueCustomName}`] == null ||
          val[`value${uniqueCustomName}`] === "" ||
          !val[`operator${uniqueCustomName}${index}`]) &&
        !(
          val[`fieldName${uniqueCustomName}`] === "" &&
          val[`value${uniqueCustomName}`] === "" &&
          !val[`operator${uniqueCustomName}${index}`]
        )
      ) {
        filterCorrect = false;
        break;
      }

      let data: any = {};
      if (
        val[`operator${uniqueCustomName}${index}`].includes("pt_") ||
        val[`operator${uniqueCustomName}${index}`].includes("ft_")
      ) {
        let parsedValue = parseInt(val[`value${uniqueCustomName}`]);
        if (isNaN(parseInt(val[`value${uniqueCustomName}`]))) {
          parsedValue = val[`value${uniqueCustomName}`];
          console.error(
            `Error in filter value. Cannot convert ${
              val[`value${uniqueCustomName}`]
            } of ${val[`fieldName${uniqueCustomName}`]} to number`
          );
        }
        data = {
          name:
            val[`fieldName${uniqueCustomName}`] !== ""
              ? val[`fieldName${uniqueCustomName}`]
              : null,
          logicalOperator: val[`logicalOperator${uniqueCustomName}${index}`]
            ? val[`logicalOperator${uniqueCustomName}${index}`]
            : null,
        };
        data = {
          ...data,
          operator: val[`operator${uniqueCustomName}${index}`]
            ? "between"
            : null,

          value:
            // @ts-ignore
            pastAndFutureDict(parsedValue)[
              val[`operator${uniqueCustomName}${index}`]
            ],
          metadata:
            // @ts-ignore
            pastAndFutureDictMetadata(parsedValue)[
              val[`operator${uniqueCustomName}${index}`]
            ],
        };
      } else if (
        val[`value${uniqueCustomName}`] === "empty" &&
        val[`operator${uniqueCustomName}${index}`].includes("is_")
      ) {
        data = customViewFilterMaker(
          val,
          val[`operator${uniqueCustomName}${index}`] as string,
          index,
          uniqueCustomName,
          ["${empty}"]
        );
      } else if (val[`operator${uniqueCustomName}${index}`].includes("d_")) {
        // @ts-ignore
        data = dataValueFilterMapper(val, index, uniqueCustomName)[
          val[`value${uniqueCustomName}`]
        ];
      } else {
        const fieldValue = processedFieldList.filter(
          (item) => item.value === val[`fieldName${uniqueCustomName}`]
        )[0];
        const valueExtractedData = filterValueGenerator(
          fieldValue,
          val,
          uniqueCustomName,
          index,
          timezone
        );

        let valuesProcessedData = valueExtractedData;
        if (
          val[`operator${uniqueCustomName}${index}`] === "ilike" &&
          Array.isArray(valueExtractedData)
        ) {
          valuesProcessedData = valueExtractedData?.map((val) => `%${val}%`);
        }
        if (
          val[`operator${uniqueCustomName}${index}`] === "stwth" &&
          Array.isArray(valueExtractedData)
        ) {
          valuesProcessedData = valueExtractedData?.map((val) => `${val}%`);
        }
        if (
          val[`operator${uniqueCustomName}${index}`] === "endwth" &&
          Array.isArray(valueExtractedData)
        ) {
          valuesProcessedData = valueExtractedData?.map((val) => `%${val}`);
        }
        data = {
          name:
            val[`fieldName${uniqueCustomName}`] !== ""
              ? val[`fieldName${uniqueCustomName}`]
              : null,
          operator: val[`operator${uniqueCustomName}${index}`]
            ? ["stwth", "endwth"].includes(
                val[`operator${uniqueCustomName}${index}`] as string
              )
              ? "ilike"
              : val[`operator${uniqueCustomName}${index}`]
            : null,
          value: valuesProcessedData,
          logicalOperator: val[`logicalOperator${uniqueCustomName}${index}`]
            ? val[`logicalOperator${uniqueCustomName}${index}`]
            : null,
        };
      }
      filterData.push(
        val[`logicalOperatorNot${uniqueCustomName}`] === "NOT"
          ? { ...data, logicalOperator: `NOT,${data.logicalOperator}` }
          : data
      );
    }
  }
  return { filterData, filterCorrect };
};
