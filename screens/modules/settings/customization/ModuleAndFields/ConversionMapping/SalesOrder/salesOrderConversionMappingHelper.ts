import { FormikValues } from "formik";
import { SalesOrderConversionDataType } from "./SalesOrderConversionMappingScreen";
import { IConversionDropdownListType } from "../conversionTypes";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { checkMandatoryFields } from "../conversionMappingHelper";
import { FetchResult } from "@apollo/client";

export const fetchSalesOrderObjectGeneratorHelper = (
  module: string,
  value: string,
  invoiceList: IConversionDropdownListType[]
) => {
  return value === "none"
    ? null
    : module === "invoice"
    ? invoiceList.length
      ? invoiceList.filter((val) => val.value === value)[0].uniqueName
      : `crm.invoice.${value}`
    : null;
};

export const handleSalesOrderMappingFormSaveHelper = (
  values: FormikValues,
  changedValuesList: string[],
  rootPermissionData: Record<string, string | null>[],
  salesOrderConversionData: SalesOrderConversionDataType,
  invoiceList: IConversionDropdownListType[],
  salesOrderListItems: IConversionDropdownListType[],
  mandatoryFields: Record<string, ICustomField[]>
) => {
  const saveInputArray: any[] = [];
  const modifiedRootPermissionData: any[] = [...rootPermissionData];

  for (const val in values) {
    if (changedValuesList.includes(val)) {
      const [sourceFieldName, destinationModuleName] = val.split("-");
      const id =
        salesOrderConversionData[sourceFieldName]?.["invoice"]?.id || null;

      saveInputArray.push({
        id: id,
        modelName: "salesOrderConversionInvoiceMapping",
        saveInput: {
          sourceFieldUniqueName: salesOrderListItems.filter(
            (val) => val.value === sourceFieldName
          )[0].uniqueName,
          sourceModuleUniqueName: "crm.sales_order",
          destinationFieldUniqueName: fetchSalesOrderObjectGeneratorHelper(
            destinationModuleName,
            values[val],
            invoiceList
          ),
          destinationModuleUniqueName: `crm.invoice`,
        },
      });
    }
  }

  for (const saveData of saveInputArray) {
    let set = false;
    for (let i = 0; i < modifiedRootPermissionData.length; i++) {
      const permissionData = modifiedRootPermissionData[i];
      if (
        saveData.saveInput["sourceFieldUniqueName"] ===
          permissionData["sourceFieldUniqueName"] &&
        saveData.saveInput["destinationModuleUniqueName"] ===
          permissionData["destinationModuleUniqueName"]
      ) {
        modifiedRootPermissionData[i] = saveData.saveInput;
        set = true;
      }
    }
    if (!set) {
      modifiedRootPermissionData.push(saveData.saveInput);
    }
  }

  const message = checkMandatoryFields(
    modifiedRootPermissionData,
    mandatoryFields
  );

  return { saveInputArray, modifiedRootPermissionData, message };
};

export const salesOrderMappingResponseDataHandler = (
  result: FetchResult<any, Record<string, any>, Record<string, any>>[],
  salesOrderConversionData: SalesOrderConversionDataType,
  originalListValues: Record<string, string | null>
) => {
  const salesOrderConversionDataDict = { ...salesOrderConversionData };
  const updatedListValues: Record<string, string | null> = {
    ...originalListValues,
  };

  result.forEach((val) => {
    const data = val.data.save.data;
    const name = data.sourceFieldUniqueName.split(".").pop();
    const value = data?.destinationFieldUniqueName?.split(".")?.pop() || null;

    if (data.destinationModuleUniqueName === "crm.invoice") {
      updatedListValues[`${name}-invoice`] =
        value || updatedListValues[`${name}-invoice`] || null;

      if (salesOrderConversionDataDict[name]) {
        salesOrderConversionDataDict[name]["invoice"] = {
          id: data.id,
          value: value,
        };
      } else {
        salesOrderConversionDataDict[name] = {
          invoice: {
            id: data.id,
            value: value,
          },
        };
      }
    }
  });
  return { salesOrderConversionDataDict, updatedListValues };
};
