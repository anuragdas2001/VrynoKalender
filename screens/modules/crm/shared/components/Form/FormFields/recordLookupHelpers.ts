import { ICustomField } from "../../../../../../../models/ICustomField";
import { AccountModels } from "../../../../../../../models/Accounts";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../../utils/getFieldsFromDisplayExpression";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const searchByHelper = (
  field: ICustomField,
  genericModels: IGenericModel
): string[] => {
  if (!field.dataTypeMetadata?.allLookups) {
    return [];
  }
  if (
    field.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1] ===
    AccountModels.User
  ) {
    return ["first_name", "last_name"];
  }

  return evaluateDisplayExpression(
    getFieldsFromDisplayExpression(
      field.dataTypeMetadata?.allLookups[0]?.displayExpression
    ),
    genericModels[
      field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
    ]?.layouts[0]?.config?.fields || []
  );
};

export const searchByDisplayExpression = (field: ICustomField): string[] => {
  if (!field.dataTypeMetadata?.allLookups) {
    return [];
  }
  if (
    field.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1] ===
    AccountModels.User
  ) {
    return ["first_name", "last_name"];
  }

  return getFieldsFromDisplayExpression(
    field.dataTypeMetadata?.allLookups[0]?.displayExpression
  );
};

export const defaultOnSearchIconClick = (field: ICustomField): boolean => {
  if (!field.dataTypeMetadata?.allLookups) {
    return false;
  }
  return (
    ["dealPipelineStage", "dealPipeline"].includes(
      field.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
    ) && field.systemDefined
  );
};

export const retainDefaultValues = (field: ICustomField) => {
  return (
    ["ownerId", "dealStageId", "dealPipelineId"].includes(field.name) &&
    field.systemDefined
  );
};

export const fieldSpecificAppAndModel = (field: ICustomField): string[] => {
  return field.dataTypeMetadata?.allLookups
    ? field.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")
    : ["", ""];
};
