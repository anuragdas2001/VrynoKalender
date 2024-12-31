import { FormikValues } from "formik";
import { LeadConversionAllowedValues } from "../../../../../../shared/constants";
import { ICustomField } from "../../../../../../models/ICustomField";
import {
  IConvertLeadData,
  IExtractedValues,
  ILeadContactOrganization,
  IMutationGeneratorResult,
  IMutationGeneratorResultData,
} from "./genericLeadConversionInterfaces";
import { BaseGenericObjectType } from "../../../../../../models/shared";

const moduleValueExtractor = (
  targetModuleName: string,
  values: FormikValues,
  fieldsList: ICustomField[]
) => {
  let extractedValues: IExtractedValues = {};
  for (const key in values) {
    const [modelName, valueName] = key.split("-");
    if (modelName === targetModuleName) {
      const activeField = fieldsList.filter((field) => field.name === key)[0];
      if (activeField.systemDefined) {
        extractedValues = {
          ...extractedValues,
          [valueName]: values[key],
        };
      } else {
        extractedValues = {
          ...extractedValues,
          fields: { ...extractedValues.fields, [valueName]: values[key] },
        };
      }
    }
  }
  return extractedValues;
};

const saveMutationRequestGenerator = (
  defaultOnly: boolean,
  contactOrganizationData: { name: string; id: string | null }[],
  values: FormikValues,
  layoutIds: {
    contact: string | null;
    organization: string | null;
    deal: string | null;
  },
  contactFieldList: ICustomField[],
  organizationFieldList: ICustomField[],
  dealFieldList: ICustomField[]
) => {
  let resultObject: IMutationGeneratorResult = {};
  for (const val of contactOrganizationData) {
    if (val.name === "contact") {
      resultObject = {
        ...resultObject,
        [val.name]: val.id?.length
          ? {
              id: val.id,
              ownerId: values.ownerId,
              layoutId: layoutIds.contact,
            }
          : {
              ...moduleValueExtractor("contact", values, contactFieldList),
              ownerId: values.ownerId,
              layoutId: layoutIds.contact,
            },
      };
    } else if (val.name === "organization") {
      resultObject = {
        ...resultObject,
        [val.name]: val.id?.length
          ? {
              id: val.id,
              ownerId: values.ownerId,
              layoutId: layoutIds.organization,
            }
          : {
              ...moduleValueExtractor(
                "organization",
                values,
                organizationFieldList
              ),
              ownerId: values.ownerId,
              layoutId: layoutIds.organization,
            },
      };
    }
  }
  if (!defaultOnly) {
    resultObject = {
      ...resultObject,
      deal: {
        ...moduleValueExtractor("deal", values, dealFieldList),
        ownerId: values.ownerId,
        layoutId: layoutIds.deal,
      },
    };
  }
  return resultObject;
};

export const handleLeadConvertDataTransformation = (
  values: FormikValues,
  leadDeal: {
    checked: boolean;
  },
  companyAvailable: null | boolean,
  leadOrganization: ILeadContactOrganization,
  leadContact: ILeadContactOrganization,
  layoutIds: {
    contact: string | null;
    organization: string | null;
    deal: string | null;
  },
  contactFieldList: ICustomField[],
  organizationFieldList: ICustomField[],
  dealFieldList: ICustomField[]
) => {
  let leadSaveDefaultObject: IMutationGeneratorResult = {};
  if (leadDeal.checked === false) {
    if (companyAvailable) {
      leadSaveDefaultObject = saveMutationRequestGenerator(
        true,
        [
          {
            name: LeadConversionAllowedValues.organization,
            id: leadOrganization.selectedId,
          },
          {
            name: LeadConversionAllowedValues.contact,
            id: leadContact.selectedId,
          },
        ],
        values,
        layoutIds,
        contactFieldList,
        organizationFieldList,
        dealFieldList
      );
    } else {
      leadSaveDefaultObject = saveMutationRequestGenerator(
        true,
        [
          {
            name: LeadConversionAllowedValues.contact,
            id: leadContact.selectedId,
          },
        ],
        values,
        layoutIds,
        contactFieldList,
        organizationFieldList,
        dealFieldList
      );
    }
  } else {
    if (companyAvailable) {
      leadSaveDefaultObject = saveMutationRequestGenerator(
        false,
        [
          {
            name: LeadConversionAllowedValues.organization,
            id: leadOrganization.selectedId,
          },
          {
            name: LeadConversionAllowedValues.contact,
            id: leadContact.selectedId,
          },
        ],
        values,
        layoutIds,
        contactFieldList,
        organizationFieldList,
        dealFieldList
      );
    } else {
      leadSaveDefaultObject = saveMutationRequestGenerator(
        false,
        [
          {
            name: LeadConversionAllowedValues.contact,
            id: leadContact.selectedId,
          },
        ],
        values,
        layoutIds,
        contactFieldList,
        organizationFieldList,
        dealFieldList
      );
    }
  }
  return leadSaveDefaultObject;
};

export const leadConvertSaveDataHelper = (
  field: "company" | "fullName",
  data: IMutationGeneratorResultData,
  selectedData: BaseGenericObjectType[],
  leadData: IConvertLeadData
) => {
  let value = "";
  if (data.name) {
    value = data.name;
  } else if (data.id) {
    value = selectedData[0].name;
  } else {
    value = leadData[field] || "";
  }
  return value;
};

export const handleItemSelect = (
  item: BaseGenericObjectType,
  selectedData: BaseGenericObjectType[]
) => {
  if (selectedData.filter((sItem) => sItem.id === item.id).length === 0) {
    return [item];
  } else {
    const data = selectedData.filter((sItem) => sItem.id !== item.id);
    return data;
  }
};

export const conversionFilterHelper = (
  fieldsList: ICustomField[],
  mappedModuleFieldsList: string[],
  convertLeadData: IConvertLeadData,
  masterMappedFieldsList: Record<string, string>,
  leadFieldsList: ICustomField[],
  type: "contact" | "organization" | "deal"
) => {
  const fieldsData = [];
  for (let i = 0; i < fieldsList.length; i++) {
    const field = fieldsList[i];
    if (
      type === "deal" &&
      [
        "deal-currency",
        "deal-amount",
        "deal-name",
        "deal-dealPipelineId",
        "deal-dealStageId",
        "ownerId",
      ].includes(field.name)
    ) {
      fieldsData.push(field);
      continue;
    }
    if (!mappedModuleFieldsList.includes(field.uniqueName)) {
      fieldsData.push(field);
      continue;
    }
    leadFieldsList.forEach((leadField) => {
      if (
        leadField.uniqueName === masterMappedFieldsList[field.uniqueName] &&
        !convertLeadData[leadField.name]
      ) {
        fieldsData.push(field);
      }
    });
  }
  return fieldsData;
};

export const conversionLModuleFieldsExtractor = (
  moduleName: string,
  fields: ICustomField[]
) => {
  return fields
    .filter(
      (field) =>
        field.mandatory &&
        !["ownerId", "contactId", "organizationId"].includes(field.name)
    )
    .map((field) => {
      return { ...field, name: `${moduleName}-${field.name}` };
    });
};
