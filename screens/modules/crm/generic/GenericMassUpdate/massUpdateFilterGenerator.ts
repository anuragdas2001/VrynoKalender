import { FormikValues } from "formik";
import { toast } from "react-toastify";
import {
  BaseGenericObjectType,
  ICriteriaFilterRow,
} from "../../../../../models/shared";
import { ICustomField } from "../../../../../models/ICustomField";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import { customViewFilterGenerator } from "../GenericAddCustomView/customViewHelpers/customViewFilterGenerator";
import {
  valueToConditionListMapper,
  systemDefinedFieldExtractor,
} from "../GenericAddCustomView/customViewHelpers/customViewSave";

export const massUpdateFilterGenerator = (
  values: FormikValues,
  conditionList: ICriteriaFilterRow[],
  modelName: string,
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string,
  fieldsList: ICustomField[],
  timezone?: string
) => {
  if (conditionList.length === 1 && conditionList[0].fieldName === "") {
    toast.error("Please add conditions");
    return;
  }
  let updatedConditionList = [...conditionList];
  updatedConditionList = valueToConditionListMapper(
    conditionList,
    updatedConditionList,
    values,
    uniqueCustomName
  );

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
  let updatedFilterData: {
    operator: string;
    name: string;
    value: string | string[];
    logicalOperator?: string | undefined;
    metadata?: string | undefined;
  }[] = [];
  filterData.forEach((val) => {
    if (val?.name !== null) {
      let value: {
        operator: string;
        name: string;
        value: string | string[];
        logicalOperator?: string | undefined;
        metadata?: string | undefined;
      } = {
        name: "",
        operator: "",
        value: "",
      };
      if (val?.logicalOperator === null) {
        value = {
          name: val?.name,
          operator: val?.operator,
          value: val?.value,
        };
      } else {
        value = val;
      }
      if (val?.metadata) {
        value = { ...value, metadata: val.metadata };
      }
      updatedFilterData.push(value);
    }
  });
  updatedFilterData = updatedFilterData.map((val) =>
    systemDefinedFieldExtractor(val, processedFieldList)
  );
  return {
    modelName: modelName,
    fields: getVisibleFieldsArray(fieldsList),
    filters: updatedFilterData,
    expression: values.expression,
  };
};
