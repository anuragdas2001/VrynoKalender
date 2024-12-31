import { FormikValues } from "formik";
import { FetchResult } from "@apollo/client";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { LeadConversionDataType } from "./LeadConversionMappingScreen";
import { ILeadDropdownListType } from "../../../../../../../models/shared";
import { checkMandatoryFields } from "../conversionMappingHelper";

export const leadMappingResponseDataHandler = (
  result: FetchResult<any, Record<string, any>, Record<string, any>>[],
  leadConversionData: LeadConversionDataType
) => {
  let leadConversionDataDict = { ...leadConversionData };
  let list = {};
  result.forEach((val) => {
    let name = "";
    const data = val.data.save.data;
    name = data.sourceLeadFieldUniqueName.split(".").pop();
    list = {
      ...list,
      [`${name}-contact`]: data.destinationContactFieldUniqueName
        ? data.destinationContactFieldUniqueName.split(".").pop()
        : null,
    };
    list = {
      ...list,
      [`${name}-deal`]: data.destinationDealFieldUniqueName
        ? data.destinationDealFieldUniqueName.split(".").pop()
        : null,
    };
    list = {
      ...list,
      [`${name}-organization`]: data.destinationOrganizationFieldUniqueName
        ? data.destinationOrganizationFieldUniqueName.split(".").pop()
        : null,
    };
    leadConversionDataDict = {
      ...leadConversionDataDict,
      [name]: {
        id: data.id,
        organization:
          data.destinationOrganizationFieldUniqueName &&
          data.destinationOrganizationFieldUniqueName.split(".").pop(),
        organizationUniqueName: data.destinationOrganizationFieldUniqueName,
        contact:
          data.destinationContactFieldUniqueName &&
          data.destinationContactFieldUniqueName.split(".").pop(),
        contactUniqueName: data.destinationContactFieldUniqueName,
        deal:
          data.destinationDealFieldUniqueName &&
          data.destinationDealFieldUniqueName.split(".").pop(),
        dealUniqueName: data.destinationDealFieldUniqueName,
      },
    };
  });
  return { leadConversionDataDict, list };
};

export const leadDropdownListHelper = (
  fieldsList: ICustomField[],
  excludedFields: Set<string>,
  additionalExcludedFields: Record<string, string>
) => {
  const resultArray: ILeadDropdownListType[] = [];
  for (const field of fieldsList) {
    const key: string = field.uniqueName.split(".").pop() || "";
    if (
      excludedFields.has(key) ||
      additionalExcludedFields[key] ||
      field.readOnly === true ||
      field.visible === false
    ) {
      continue;
    }
    resultArray.push({
      value: key,
      label: field.label.en,
      dataType: field.dataType,
      uniqueName: field.uniqueName,
      dataTypeMetadata: field.dataTypeMetadata,
    });
  }
  return resultArray;
};

export const fetchObjectGeneratorHelper = (
  module: string,
  value: string,
  id: string | null,
  fieldName: string,
  type: string,
  organizationList: ILeadDropdownListType[],
  contactList: ILeadDropdownListType[],
  dealList: ILeadDropdownListType[],
  leadListItems: ILeadDropdownListType[]
) => {
  const saveKey =
    module === "organization"
      ? `destinationOrganizationFieldUniqueName`
      : module === "contact"
      ? `destinationContactFieldUniqueName`
      : `destinationDealFieldUniqueName`;
  const saveValue =
    fieldName === "none"
      ? "none"
      : module === "organization"
      ? organizationList.length
        ? organizationList.filter((val) => val.value === fieldName)[0]
            .uniqueName
        : `crm.organization.${value}`
      : module === "contact"
      ? contactList.length
        ? contactList.filter((val) => val.value === fieldName)[0].uniqueName
        : `crm.contact.${value}`
      : dealList.length
      ? dealList.filter((val) => val.value === fieldName)[0].uniqueName
      : `crm.deal.${value}`;
  return {
    [saveKey]: saveValue,
    id: id,
    uniqueName: leadListItems.filter((val) => val.value === type)[0].uniqueName,
  };
};

export const leadSaveInputGenerator = (
  value: {
    [x: string]: string | null;
    id: string | null;
    uniqueName: string;
  },
  valueString: string,
  key: string,
  module: string,
  uniqueMod: string,
  leadConversionData: Record<string, any>
) => {
  return value[valueString]
    ? value[valueString]?.split(".").pop() === "none"
      ? null
      : value[valueString]
    : leadConversionData[key] &&
      leadConversionData[key] !== null &&
      leadConversionData[key][module]
    ? leadConversionData[key][uniqueMod]
      ? leadConversionData[key][uniqueMod]
      : `crm.${module}.${leadConversionData[key].module}`
    : null;
};

export const handleFormSaveHelper = (
  values: FormikValues,
  changedValuesList: string[],
  rootPermissionData: Record<string, string | null>[],
  leadConversionData: LeadConversionDataType,
  organizationList: ILeadDropdownListType[],
  contactList: ILeadDropdownListType[],
  dealList: ILeadDropdownListType[],
  leadListItems: ILeadDropdownListType[],
  mandatoryFields: Record<string, ICustomField[]>
) => {
  let requestArray: Record<
    string,
    {
      [x: string]: string | null;
      id: string | null;
      uniqueName: string;
    }
  > = {};
  const saveInputArray = [];
  // let modifiedRootPermissionData:  Record<string, string | null>[] = [...rootPermissionData];
  const modifiedRootPermissionData: any[] = [...rootPermissionData];

  for (const val in values) {
    if (changedValuesList.includes(val)) {
      const [type, module] = val.split("-");
      const id = leadConversionData[type] ? leadConversionData[type].id : null;
      requestArray = {
        ...requestArray,
        [type]: {
          ...requestArray[type],
          ...fetchObjectGeneratorHelper(
            module,
            values[val],
            id,
            values[val],
            type,
            organizationList,
            contactList,
            dealList,
            leadListItems
          ),
        },
      };
    }
  }

  for (const key in requestArray) {
    const value = requestArray[key];
    saveInputArray.push({
      id: value.id,
      modelName: "leadConversionMapping",
      saveInput: {
        sourceLeadFieldUniqueName: value.uniqueName,
        destinationOrganizationFieldUniqueName: leadSaveInputGenerator(
          value,
          "destinationOrganizationFieldUniqueName",
          key,
          "organization",
          "organizationUniqueName",
          leadConversionData
        ),
        destinationContactFieldUniqueName: leadSaveInputGenerator(
          value,
          "destinationContactFieldUniqueName",
          key,
          "contact",
          "contactUniqueName",
          leadConversionData
        ),
        destinationDealFieldUniqueName: leadSaveInputGenerator(
          value,
          "destinationDealFieldUniqueName",
          key,
          "deal",
          "dealUniqueName",
          leadConversionData
        ),
      },
    });
  }

  for (const saveData of saveInputArray) {
    let set = false;
    for (let i = 0; i < modifiedRootPermissionData.length; i++) {
      const permissionData = modifiedRootPermissionData[i];
      if (
        saveData.saveInput["sourceLeadFieldUniqueName"] ===
        permissionData["sourceLeadFieldUniqueName"]
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
