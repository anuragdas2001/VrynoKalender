import { FormikValues } from "formik";
import { IConversionDropdownListType } from "../conversionTypes";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { checkMandatoryFields } from "../conversionMappingHelper";
import { FetchResult } from "@apollo/client";
import { QuotedItemConversionDataType } from "./QuotedItemConversionMappingScreen";

export const fetchQuotedItemObjectGeneratorHelper = (
  module: string,
  value: string,
  orderedItemList: IConversionDropdownListType[],
  invoicedItemList: IConversionDropdownListType[]
) => {
  return value === "none"
    ? null
    : module === "orderedItem"
    ? orderedItemList.length
      ? orderedItemList.filter((val) => val.value === value)[0].uniqueName
      : `crm.ordereditem.${value}`
    : module === "invoicedItem"
    ? invoicedItemList.length
      ? invoicedItemList.filter((val) => val.value === value)[0].uniqueName
      : `crm.invoiceditem.${value}`
    : null;
};

export const handleQuotedItemMappingFormSaveHelper = (
  values: FormikValues,
  changedValuesList: string[],
  rootPermissionData: Record<string, string | null>[],
  quotedItemConversionData: QuotedItemConversionDataType,
  orderedItemList: IConversionDropdownListType[],
  invoicedItemList: IConversionDropdownListType[],
  quotedItemListItems: IConversionDropdownListType[],
  mandatoryFields: Record<string, ICustomField[]>
) => {
  const saveInputArray: any[] = [];
  const modifiedRootPermissionData: any[] = [...rootPermissionData];

  for (const val in values) {
    if (changedValuesList.includes(val)) {
      const [sourceFieldName, destinationModuleName] = val.split("-");
      const id =
        quotedItemConversionData[sourceFieldName]?.[
          destinationModuleName as "orderedItem" | "invoicedItem"
        ]?.id || null;

      saveInputArray.push({
        id: id,
        modelName:
          destinationModuleName === "orderedItem"
            ? "quotedItemConversionOrderedItemMapping"
            : "quotedItemConversionInvoicedItemMapping",
        saveInput: {
          sourceFieldUniqueName: quotedItemListItems.filter(
            (val) => val.value === sourceFieldName
          )[0].uniqueName,
          sourceModuleUniqueName: "crm.quoted_item",
          destinationFieldUniqueName: fetchQuotedItemObjectGeneratorHelper(
            destinationModuleName,
            values[val],
            orderedItemList,
            invoicedItemList
          ),
          destinationModuleUniqueName: `crm.${
            destinationModuleName === "orderedItem"
              ? "ordered_item"
              : "invoiced_item"
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

export const quotedItemMappingResponseDataHandler = (
  result: FetchResult<any, Record<string, any>, Record<string, any>>[],
  quotedItemConversionData: QuotedItemConversionDataType,
  originalListValues: Record<string, string | null>
) => {
  const quoteConversionDataDict = { ...quotedItemConversionData };
  const updatedListValues: Record<string, string | null> = {
    ...originalListValues,
  };

  result.forEach((val) => {
    const data = val.data.save.data;
    const name = data.sourceFieldUniqueName.split(".").pop();
    const value = data?.destinationFieldUniqueName?.split(".")?.pop() || null;

    if (data.destinationModuleUniqueName === "crm.ordered_item") {
      updatedListValues[`${name}-orderedItem`] =
        value || updatedListValues[`${name}-orderedItem`] || null;

      if (quoteConversionDataDict[name]) {
        quoteConversionDataDict[name]["orderedItem"] = {
          id: data.id,
          value: value,
        };
      } else {
        quoteConversionDataDict[name] = {
          orderedItem: {
            id: data.id,
            value: value,
          },
          invoicedItem: { id: null, value: null },
        };
      }
    }
    if (data.destinationModuleUniqueName === "crm.invoiced_item") {
      updatedListValues[`${name}-invoicedItem`] =
        value || updatedListValues[`${name}-invoicedItem`] || null;

      if (quoteConversionDataDict[name]) {
        quoteConversionDataDict[name]["invoicedItem"] = {
          id: data.id,
          value: value,
        };
      } else {
        quoteConversionDataDict[name] = {
          orderedItem: {
            id: null,
            value: null,
          },
          invoicedItem: {
            id: data.id,
            value: value,
          },
        };
      }
    }
  });
  return { quoteConversionDataDict, updatedListValues };
};
