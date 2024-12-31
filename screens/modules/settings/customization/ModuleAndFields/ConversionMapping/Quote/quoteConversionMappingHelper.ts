import { FormikValues } from "formik";
import { QuoteConversionDataType } from "./QuoteConversionMappingScreen";
import { IConversionDropdownListType } from "../conversionTypes";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { checkMandatoryFields } from "../conversionMappingHelper";
import { FetchResult } from "@apollo/client";

export const fetchQuoteObjectGeneratorHelper = (
  module: string,
  value: string,
  salesOrderList: IConversionDropdownListType[],
  invoiceList: IConversionDropdownListType[]
) => {
  return value === "none"
    ? null
    : module === "salesOrder"
    ? salesOrderList.length
      ? salesOrderList.filter((val) => val.value === value)[0].uniqueName
      : `crm.salesorder.${value}`
    : module === "invoice"
    ? invoiceList.length
      ? invoiceList.filter((val) => val.value === value)[0].uniqueName
      : `crm.invoice.${value}`
    : null;
};

export const handleQuoteMappingFormSaveHelper = (
  values: FormikValues,
  changedValuesList: string[],
  rootPermissionData: Record<string, string | null>[],
  quoteConversionData: QuoteConversionDataType,
  salesOrderList: IConversionDropdownListType[],
  invoiceList: IConversionDropdownListType[],
  quoteListItems: IConversionDropdownListType[],
  mandatoryFields: Record<string, ICustomField[]>
) => {
  const saveInputArray: any[] = [];
  const modifiedRootPermissionData: any[] = [...rootPermissionData];

  for (const val in values) {
    if (changedValuesList.includes(val)) {
      const [sourceFieldName, destinationModuleName] = val.split("-");
      const id =
        quoteConversionData[sourceFieldName]?.[
          destinationModuleName as "salesOrder" | "invoice"
        ]?.id || null;

      saveInputArray.push({
        id: id,
        modelName:
          destinationModuleName === "salesOrder"
            ? "quoteConversionSalesOrderMapping"
            : "quoteConversionInvoiceMapping",
        saveInput: {
          sourceFieldUniqueName: quoteListItems.filter(
            (val) => val.value === sourceFieldName
          )[0].uniqueName,
          sourceModuleUniqueName: "crm.quote",
          destinationFieldUniqueName: fetchQuoteObjectGeneratorHelper(
            destinationModuleName,
            values[val],
            salesOrderList,
            invoiceList
          ),
          destinationModuleUniqueName: `crm.${
            destinationModuleName === "salesOrder" ? "sales_order" : "invoice"
          }`,
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
        permissionData["sourceFieldUniqueName"]
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

export const quoteMappingResponseDataHandler = (
  result: FetchResult<any, Record<string, any>, Record<string, any>>[],
  quoteConversionData: QuoteConversionDataType,
  originalListValues: Record<string, string | null>
) => {
  const quoteConversionDataDict = { ...quoteConversionData };
  const updatedListValues: Record<string, string | null> = {
    ...originalListValues,
  };

  result.forEach((val) => {
    const data = val.data.save.data;
    const name = data.sourceFieldUniqueName.split(".").pop();
    const value = data?.destinationFieldUniqueName?.split(".")?.pop() || null;

    if (data.destinationModuleUniqueName === "crm.sales_order") {
      updatedListValues[`${name}-salesOrder`] =
        value || updatedListValues[`${name}-salesOrder`] || null;

      if (quoteConversionDataDict[name]) {
        quoteConversionDataDict[name]["salesOrder"] = {
          id: data.id,
          value: value,
        };
      } else {
        quoteConversionDataDict[name] = {
          salesOrder: {
            id: data.id,
            value: value,
          },
          invoice: {
            id: null,
            value: null,
          },
        };
      }
    }
    if (data.destinationModuleUniqueName === "crm.invoice") {
      updatedListValues[`${name}-invoice`] =
        value || updatedListValues[`${name}-invoice`] || null;

      if (quoteConversionDataDict[name]) {
        quoteConversionDataDict[name]["invoice"] = {
          id: data.id,
          value: value,
        };
      } else {
        quoteConversionDataDict[name] = {
          salesOrder: {
            id: null,
            value: null,
          },
          invoice: {
            id: data.id,
            value: value,
          },
        };
      }
    }
  });
  return { quoteConversionDataDict, updatedListValues };
};
