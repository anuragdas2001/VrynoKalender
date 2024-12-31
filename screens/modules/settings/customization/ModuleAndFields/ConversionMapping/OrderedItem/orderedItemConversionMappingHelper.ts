import { FormikValues } from "formik";
import { OrderedItemConversionDataType } from "./OrderedItemConversionMappingScreen";
import { IConversionDropdownListType } from "../conversionTypes";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { checkMandatoryFields } from "../conversionMappingHelper";
import { FetchResult } from "@apollo/client";

export const fetchOrderedItemObjectGeneratorHelper = (
  module: string,
  value: string,
  invoicedItemList: IConversionDropdownListType[]
) => {
  return value === "none"
    ? null
    : module === "invoicedItem"
    ? invoicedItemList.length
      ? invoicedItemList.filter((val) => val.value === value)[0].uniqueName
      : `crm.invoiced_item.${value}`
    : null;
};

export const handleOrderedItemMappingFormSaveHelper = (
  values: FormikValues,
  changedValuesList: string[],
  rootPermissionData: Record<string, string | null>[],
  orderedItemConversionData: OrderedItemConversionDataType,
  invoicedItemList: IConversionDropdownListType[],
  orderedItemListItems: IConversionDropdownListType[],
  mandatoryFields: Record<string, ICustomField[]>
) => {
  const saveInputArray: any[] = [];
  const modifiedRootPermissionData: any[] = [...rootPermissionData];

  for (const val in values) {
    if (changedValuesList.includes(val)) {
      const [sourceFieldName, destinationModuleName] = val.split("-");
      const id =
        orderedItemConversionData[sourceFieldName]?.["invoicedItem"]?.id ||
        null;

      saveInputArray.push({
        id: id,
        modelName: "orderedItemConversionInvoicedItemMapping",
        saveInput: {
          sourceFieldUniqueName: orderedItemListItems.filter(
            (val) => val.value === sourceFieldName
          )[0].uniqueName,
          sourceModuleUniqueName: "crm.ordered_item",
          destinationFieldUniqueName: fetchOrderedItemObjectGeneratorHelper(
            destinationModuleName,
            values[val],
            invoicedItemList
          ),
          destinationModuleUniqueName: `crm.invoiced_item`,
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

export const orderedItemMappingResponseDataHandler = (
  result: FetchResult<any, Record<string, any>, Record<string, any>>[],
  orderedItemConversionData: OrderedItemConversionDataType,
  originalListValues: Record<string, string | null>
) => {
  const orderedItemConversionDataDict = { ...orderedItemConversionData };
  const updatedListValues: Record<string, string | null> = {
    ...originalListValues,
  };

  result.forEach((val) => {
    const data = val.data.save.data;
    const name = data.sourceFieldUniqueName.split(".").pop();
    const value = data?.destinationFieldUniqueName?.split(".")?.pop() || null;

    if (data.destinationModuleUniqueName === "crm.invoiced_item") {
      updatedListValues[`${name}-invoicedItem`] =
        value || updatedListValues[`${name}-invoicedItem`] || null;

      if (orderedItemConversionDataDict[name]) {
        orderedItemConversionDataDict[name]["invoicedItem"] = {
          id: data.id,
          value: value,
        };
      } else {
        orderedItemConversionDataDict[name] = {
          invoicedItem: {
            id: data.id,
            value: value,
          },
        };
      }
    }
  });
  return { orderedItemConversionDataDict, updatedListValues };
};
