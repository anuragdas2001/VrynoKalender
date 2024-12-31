import { toast } from "react-toastify";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import { ISimplifiedCustomField } from "../../../shared/utils/getOrderedFieldsList";
import { customViewFilterGenerator } from "./customViewFilterGenerator";
import { ICustomField } from "../../../../../../models/ICustomField";

export const systemDefinedFieldExtractor = (
  val: any,
  processedFieldList: any[]
) => {
  let systemDefined = true;
  processedFieldList.forEach((field: any) => {
    if (field.value == val.name && field.systemDefined === false) {
      systemDefined = false;
    }
  });
  if (systemDefined) {
    return val;
  } else {
    return { ...val, name: `fields.${val.name}` };
  }
};

export const valueToConditionListMapper = (
  conditionList: ICriteriaFilterRow[],
  updatedConditionListOriginal: any[],
  values: any,
  uniqueCustomName: string
) => {
  let updatedConditionList = [...updatedConditionListOriginal];
  updatedConditionList = updatedConditionList.map((value, index) => {
    if (
      value[`operator${uniqueCustomName}${index}`] === "between" &&
      (values[`value${uniqueCustomName}${index}-between-start`] ||
        values[`value${uniqueCustomName}${index}-between-end`])
    ) {
      return { ...value, [`value${uniqueCustomName}`]: "" };
    }
    return value;
  });
  conditionList.forEach((val, index) => {
    for (const key in values) {
      if (
        key === `value${uniqueCustomName}${index}` &&
        val[`operator${uniqueCustomName}${index}`] !== "between"
      ) {
        updatedConditionList[index] = {
          ...val,
          [`value${uniqueCustomName}`]: values[key],
        };
      }
      if (
        key === `value${uniqueCustomName}${index}-between-start` ||
        key === `value${uniqueCustomName}${index}-between-end`
      ) {
        if (val[`operator${uniqueCustomName}${index}`] !== "between") continue;
        if (
          key === `value${uniqueCustomName}${index}-between-start` &&
          !values[`value${uniqueCustomName}${index}-between-end`]
        ) {
          toast.error("Please enter between values");
          return false;
        }
        updatedConditionList[index] = {
          ...val,
          [`value${uniqueCustomName}`]:
            updatedConditionList[index][`value${uniqueCustomName}`] &&
            Array.isArray(
              updatedConditionList[index][`value${uniqueCustomName}`]
            )
              ? [
                  ...(updatedConditionList[index][
                    `value${uniqueCustomName}`
                  ] as any),
                  values[key],
                ]
              : [values[key]],
        };
      }
    }
  });
  return updatedConditionList;
};

export const customViewSave = (
  values: any,
  selectedFieldsList: ISimplifiedCustomField[],
  conditionList: ICriteriaFilterRow[],
  orderByList: any[],
  modelName: string,
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string,
  fieldsList: ICustomField[],
  timezone?: string
) => {
  if (!values["customViewName"].length) {
    toast.error("Please enter a view name");
    return false;
  }
  if (selectedFieldsList.length === 0) {
    toast.error("Please select fields");
    return false;
  }
  const hiddenSelectedFields: string[] = [];
  selectedFieldsList.forEach((field) => {
    const f = fieldsList.filter(
      (f) => f.name !== "recordStatus" && f.name === field.value
    )?.[0];
    if (field.value === f?.name && !f?.visible) {
      hiddenSelectedFields.push(f.label.en);
    }
  });
  if (hiddenSelectedFields.length) {
    toast.error(
      `Cannot use hidden Selected Field${
        hiddenSelectedFields?.length > 1 ? "s" : ""
      }: ${hiddenSelectedFields.join(", ")}`
    );
    return false;
  }
  let updatedConditionList = [...conditionList];
  updatedConditionList = valueToConditionListMapper(
    conditionList,
    updatedConditionList,
    values,
    uniqueCustomName
  );

  let orderByCorrect = true;
  for (let i = 0; i < orderByList.length; i++) {
    const val = orderByList[i][`orderByName${i}`];
    for (let j = i + 1; j < orderByList.length; j++) {
      if (val === orderByList[j][`orderByName${j}`]) {
        orderByCorrect = false;
        break;
      }
    }
  }
  if (!orderByCorrect) {
    toast.error("Order values must be unique");
    return false;
  }

  let { filterData, filterCorrect } = customViewFilterGenerator(
    updatedConditionList,
    processedFieldList,
    uniqueCustomName,
    timezone
  );
  if (!filterCorrect) {
    toast.error("Filter values cannot be blank");
    return false;
  }
  for (let i = 0; i < orderByList.length; i++) {
    if (
      (orderByList[i][`orderByName${i}`] ||
        orderByList[i][`orderByOrder${i}`]) &&
      !(orderByList[i][`orderByName${i}`] && orderByList[i][`orderByOrder${i}`])
    ) {
      filterCorrect = false;
    }
  }
  if (!filterCorrect) {
    toast.error("Order by values cannot be blank");
    return false;
  }
  let updatedFilterData: any = [];
  filterData.forEach((val) => {
    if (val?.name !== null) {
      let value = {};
      if (val?.logicalOperator === null) {
        value = {
          name: val?.name,
          operator: val?.operator,
          value: val?.value,
        };
        // updatedFilterData.push({
        //   name: val?.name,
        //   operator: val?.operator,
        //   value: val?.value,
        // });
      } else {
        value = val;
        // updatedFilterData.push(val);
      }
      if (val?.metadata) {
        value = { ...value, metadata: val.metadata };
      }
      updatedFilterData.push(value);
    }
  });
  updatedFilterData = updatedFilterData.map((val: any) =>
    systemDefinedFieldExtractor(val, processedFieldList)
  );
  const orderByData = orderByList
    .map((val, index) => {
      return {
        name: val[`orderByName${index}`] ? val[`orderByName${index}`] : null,
        order: [val[`orderByOrder${index}`]][0]
          ? [val[`orderByOrder${index}`]]
          : [],
      };
    })
    .filter((val) => val.name !== null || val.order.length !== 0);
  const updatedOrderByData = orderByData.map((val: any) =>
    systemDefinedFieldExtractor(val, processedFieldList)
  );

  return {
    moduleName: modelName,
    name: values["customViewName"],
    filters: updatedFilterData,
    moduleFields: selectedFieldsList
      .map((field) => {
        if (!field.systemDefined) {
          return `fields.${field["value"]}`;
        }
        return field["value"];
      })
      .concat(["isSample"]),
    orderBy: updatedOrderByData,
    isShared: false,
    recordsPerPage: 50,
  };
};
