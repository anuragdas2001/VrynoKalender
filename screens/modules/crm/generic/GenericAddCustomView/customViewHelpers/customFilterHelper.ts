import { FormikValues } from "formik";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";

export interface ICustomViewFilter {
  name: string;
  operator: string;
  value: null | any[];
}

export const handleFilterChangeFunction = (
  e: any,
  index: number,
  conditionList: ICriteriaFilterRow[]
) => {
  const list = [...conditionList];
  let name = e.target.name;
  let value = e.target.value;
  list[index][name] = value;
  if (
    name !== "fieldName" &&
    !name.includes("operator") &&
    !name.includes("logical")
  ) {
    list[index].value = value;
  }
  return list;
};

export const handleRemoveClickFunction = (
  index: number,
  conditionList: ICriteriaFilterRow[],
  uniqueCustomName: string
) => {
  const list = [...conditionList];
  list.splice(index, 1);
  let filteredList = [...conditionList].slice(0, index);
  for (let i = index; i < list.length; i++) {
    let filteredValues = {};
    for (const key in list[i]) {
      if (key === `logicalOperator${uniqueCustomName}${i + 1}`) {
        filteredValues = {
          ...filteredValues,
          [`logicalOperator${uniqueCustomName}${i}`]: list[i][key],
        };
      } else if (key === `operator${uniqueCustomName}${i + 1}`) {
        filteredValues = {
          ...filteredValues,
          [`operator${uniqueCustomName}${i}`]: list[i][key],
        };
      } else {
        filteredValues = {
          ...filteredValues,
          [key]: list[i][key],
        };
      }
    }
    filteredList = [...filteredList, filteredValues];
  }
  return filteredList;
};

export const handleConditionListChangeFunction = (
  conditionList: ICriteriaFilterRow[],
  fieldsList: ICustomField[],
  uniqueCustomName: string
) => {
  const stDropdown: string[] = [];
  const stField: any[] = [];
  for (let i = 0; i < conditionList.length; i++) {
    const selectedType = fieldsList.filter((val) => {
      return val.name === conditionList[i][`fieldName${uniqueCustomName}`];
    });
    if (selectedType.length > 0) {
      stDropdown.push(selectedType[0] ? selectedType[0].dataType : "");
      stField.push(selectedType[0] ? selectedType[0] : null);
    }
  }
  return [stDropdown, stField];
};

export const customFilterValueExtractor = (responseData: any[]) => {
  let filteredFilterData = [];
  if (responseData.length > 0) {
    for (let i = 0; i < responseData.length; i++) {
      let value = responseData[i];
      let expressionOperatorValue = {
        operator: "",
        value: [""],
      };
      if (!value || value.value?.length === 0) {
        filteredFilterData.push(value);
      } else if (value?.metadata) {
        const [operator, val] = value.metadata.split(",");
        filteredFilterData.push({
          name: value.name,
          operator: operator,
          value: [typeof Number(val) ? Number(val) : val],
          logicalOperator: value.logicalOperator,
        });
      } else if (
        [
          "${empty}",
          "${todayBegin}",
          "${yesterdayBegin}",
          "${past1000Years}",
          "${tomorrowBegin}",
          "${thisWeekBegin}",
          "${thisMonthBegin}",
          "${thisYearBegin}",
          "${lastWeekBegin}",
          "${lastMonthBegin}",
          "${lastYearBegin}",
          "${nextWeekBegin}",
          "${nextMonthBegin}",
          "${nextYearBegin}",
        ].includes(value.value[0].toString())
      ) {
        expressionOperatorValue = value.value[0].includes("empty")
          ? { operator: "is_empty", value: ["empty"] }
          : value.value[0].includes("past1000Years")
          ? { operator: "d_tyd", value: ["till yesterday"] }
          : value.value[0].includes("yesterday")
          ? { operator: "d_yd", value: ["yesterday"] }
          : value.value[0].includes("today")
          ? { operator: "d_t", value: ["today"] }
          : value.value[0] == "${tomorrowBegin}" &&
            value.value[1] == "${future1000Years}"
          ? { operator: "d_sttmw", value: ["starting tomorrow"] }
          : value.value[0].includes("tomorrow")
          ? { operator: "d_tmw", value: ["tomorrow"] }
          : value.value[0].includes("thisWeek")
          ? { operator: "d_tw", value: ["this week"] }
          : value.value[0].includes("lastWeek")
          ? { operator: "d_lw", value: ["last week"] }
          : value.value[0].includes("nextWeek")
          ? { operator: "d_nw", value: ["next week"] }
          : value.value[0].includes("thisMonth")
          ? { operator: "d_tm", value: ["this month"] }
          : value.value[0].includes("lastMonth")
          ? { operator: "d_lm", value: ["last month"] }
          : value.value[0].includes("nextMonth")
          ? { operator: "d_nm", value: ["next month"] }
          : value.value[0].includes("thisYear")
          ? { operator: "d_ty", value: ["this year"] }
          : value.value[0].includes("lastYear")
          ? { operator: "d_ly", value: ["last year"] }
          : { operator: "d_ny", value: ["next year"] };
        filteredFilterData.push({
          name: value.name,
          operator: expressionOperatorValue.operator,
          value: expressionOperatorValue.value,
          logicalOperator: value.logicalOperator,
        });
      } else if (value.operator === "ilike") {
        const firstValue = value.value?.[0][0] || "";
        const lastValue = value.value?.[0][value.value[0].length - 1] || "";
        const operatorValue = value.value?.length
          ? firstValue === "%" && lastValue === "%"
            ? "ilike"
            : firstValue === "%" && lastValue !== "%"
            ? "endwth"
            : "stwth"
          : "ilike";
        filteredFilterData.push({
          name: value.name,
          operator: operatorValue,
          value: !value.value?.length
            ? null
            : operatorValue === "ilike"
            ? value.value.map((val: string) => {
                return val.slice(1, val.length - 1);
              })
            : operatorValue === "stwth"
            ? value.value.map((val: string) => {
                return val.slice(0, val.length - 1);
              })
            : value.value.map((val: string) => {
                return val.slice(1, val.length);
              }),
          logicalOperator: value.logicalOperator,
        });
      } else {
        filteredFilterData.push(value);
      }
    }
    return filteredFilterData;
  } else {
    return false;
  }
};

export const removeFilterValueRectifier = (
  bypass: boolean,
  name: string,
  key: string,
  index: number,
  indexValue: number,
  resetValues: Record<string, FormikValues | null>,
  values: FormikValues,
  uniqueCustomName: string
) => {
  if (bypass)
    return {
      ...resetValues,
      [key]: values[key],
    };
  if (key === `logicalOperatorNot${uniqueCustomName}`) {
    return index === 0
      ? {
          ...resetValues,
          [`logicalOperatorNot${uniqueCustomName}`]: "",
        }
      : {
          ...resetValues,
          [key]: values[key],
        };
  }
  // if (index === 0 && indexValue !== 0) {
  //   return {
  //     ...resetValues,
  //     [`${name}${indexValue - 1}`]: values[key],
  //   };
  // } else
  if (indexValue === index) {
    return resetValues;
  } else if (indexValue < index) {
    return {
      ...resetValues,
      [key]: values[key],
    };
  } else if (indexValue > index) {
    // [key]: resetValues[key] == values[key] ? null : resetValues[key],
    if (key.includes("between")) {
      const nameArray = key.split("-");
      return {
        ...resetValues,
        [`${name}${indexValue - 1}-${nameArray[1]}-${nameArray[2]}`]:
          values[key],
        [key]: null,
      };
    }
    return {
      ...resetValues,
      [`${name}${indexValue - 1}`]: values[key],
      [key]: null,
    };
  } else {
    return { [key]: null };
  }
};

export const fieldNameExtractor = (name: string) => {
  return name.includes("fields.") ? name.slice(name.indexOf(".") + 1) : name;
};

export const pastAndFutureDictMetadata = (value: number) => {
  return {
    pt_eq: `pt_eq,${value}`,
    pt_lt: `pt_lt,${value}`,
    pt_lte: `pt_lte,${value}`,
    pt_gt: `pt_gt,${value}`,
    pt_gte: `pt_gte,${value}`,
    ft_eq: `ft_eq,${value}`,
    ft_lt: `ft_lt,${value}`,
    ft_lte: `ft_lte,${value}`,
    ft_gt: `ft_gt,${value}`,
    ft_gte: `ft_gte,${value}`,
  };
};

export const pastAndFutureDict = (value: number) => {
  return {
    pt_eq: [`\${todayBegin}-${value}`, `\${todayEnd}-${value}`],
    pt_lt: [`\${todayEnd}`, `\${todayBegin}-${value - 1}`],
    pt_lte: [`\${todayBegin}-${value}`, `\${todayEnd}`],
    pt_gt: [`\${past1000Years}`, `\${todayEnd}-${value + 1}`],
    pt_gte: [`\${past1000Years}`, `\${todayEnd}-${value}`],
    ft_eq: [`\${todayBegin}+${value}`, `\${todayEnd}+${value}`],
    ft_lt: [`\${todayBegin}+${value - 1}`, `\${todayBegin}`],
    ft_lte: [`\${todayBegin}+${value}`, `\${todayBegin}`],
    ft_gt: [`\${todayBegin}+${value + 1}`, `\${future1000Years}`],
    ft_gte: [`\${todayBegin}+${value}`, `\${future1000Years}`],
  };
};
