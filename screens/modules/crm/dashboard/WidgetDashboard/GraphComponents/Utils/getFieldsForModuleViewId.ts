import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../../models/ICustomField";
import { ICustomView } from "../../../../../../../models/shared";

export const getFieldsForModuleViewId = (
  fieldsList: ICustomField[],
  customViewList: ICustomView[],
  valueOfModuleViewId: string
) => {
  let customViewFieldIndex = customViewList?.findIndex(
    (customView) => customView.id === valueOfModuleViewId
  );
  if (customViewFieldIndex !== -1) {
    let customViewFields: any[] = customViewList[
      customViewFieldIndex
    ].moduleFields?.map((field: string) => {
      if (field.includes("fields.")) {
        const fieldIndex = fieldsList?.findIndex(
          (item) => `fields.${item.name}` === field
        );
        if (fieldIndex !== -1) {
          return {
            value: fieldsList[fieldIndex].name,
            label: fieldsList[fieldIndex].label.en,
            dataType: fieldsList[fieldIndex].dataType,
          };
        }
      } else {
        const fieldIndex = fieldsList?.findIndex((item) => item.name === field);
        if (fieldIndex !== -1) {
          return {
            value: fieldsList[fieldIndex].name,
            label: fieldsList[fieldIndex].label.en,
            dataType: fieldsList[fieldIndex].dataType,
          };
        }
      }
    });
    return customViewFields;
  } else {
    return fieldsList?.map((field) => {
      return {
        label: field.label.en,
        value: field.name,
        dataType: field.dataType,
      };
    });
  }
};
