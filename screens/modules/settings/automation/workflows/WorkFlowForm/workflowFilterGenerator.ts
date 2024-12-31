import { toast } from "react-toastify";
import {
  systemDefinedFieldExtractor,
  valueToConditionListMapper,
} from "../../../../crm/generic/GenericAddCustomView/customViewHelpers/customViewSave";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import { ISimplifiedCustomField } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { customViewFilterGenerator } from "../../../../crm/generic/GenericAddCustomView/customViewHelpers/customViewFilterGenerator";
import { FormikValues } from "formik";

export const workflowFilterGenerator = (
  values: FormikValues,
  conditionList: ICriteriaFilterRow[],
  processedFieldList: ISimplifiedCustomField[],
  uniqueCustomName: string,
  timezone?: string
) => {
  if (
    conditionList.length === 1 &&
    conditionList[0][`fieldName${uniqueCustomName}`] === ""
  ) {
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

  let updatedFilterData: any = [];
  // filterData.forEach((val) => {
  //   if (val?.name !== null) {
  //     if (val?.logicalOperator === null) {
  //       updatedFilterData.push({
  //         name: val?.name,
  //         operator: val?.operator,
  //         value: val?.value,
  //       });
  //     } else {
  //       updatedFilterData.push({
  //         name: val?.name,
  //         operator: val?.operator,
  //         value: val?.value,
  //         logicalOperator: val?.logicalOperator,
  //       });
  //     }
  //   }
  // });
  filterData.forEach((val) => {
    if (val?.name !== null) {
      let value = {};
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
  updatedFilterData = updatedFilterData.map((val: any) =>
    systemDefinedFieldExtractor(val, processedFieldList)
  );
  return updatedFilterData;
};
