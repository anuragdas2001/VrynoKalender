//get value label of field object output
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../../models/ICustomField";

export function getObjectValueLabelFieldList(fieldsList: Array<ICustomField>) {
  return fieldsList
    .filter((field) => field.visible === true)
    .map((field) => {
      return {
        value: field.name,
        label: field.label["en"],
      };
    });
}

export interface ISimplifiedCustomField {
  value: string;
  label: string;
  dataType: FieldSupportedDataType;
  systemDefined?: boolean;
  dataTypeMetadata?: any;
}

export const fieldConvertor = (field: ICustomField) => {
  return {
    value: field.name,
    label: field.label["en"],
    dataType: field.dataType,
    field: field,
  };
};

//change field object output
export function getProcessedFieldList(
  fieldsList: Array<ICustomField>
): Array<ISimplifiedCustomField> {
  return fieldsList
    .filter((field) => field.visible === true && field.readOnly === false)
    .map(fieldConvertor);
}

export function getVisibleFieldList(fieldsList: Array<ICustomField>): Array<{
  value: string;
  label: string;
  dataType: FieldSupportedDataType;
  field: ICustomField;
}> {
  return fieldsList
    .filter((field) => field.visible === true)
    .map(fieldConvertor);
}

//merge fields with layout
export function getMergedFieldList(
  fieldsList: Array<ICustomField>,
  layoutList: Record<string, any>[]
): Array<ICustomField> {
  let newLocalFields = fieldsList.map((obj, index) => {
    let layout_field = layoutList.find(
      (layoutObj) => layoutObj.uniqueName === obj.uniqueName
    );
    if (layout_field) return { ...obj, ...layout_field };
    return { ...obj };
  });
  return newLocalFields.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
}

//Sorting Fields list

export function getSortedFieldList(fieldsList: Array<ICustomField>) {
  return fieldsList?.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
}

//get custom view fields
export function getCustomViewFields(
  fieldsList: Array<ICustomField>,
  selectedFields: Array<string>
) {
  return selectedFields.map((fieldName) => {
    fieldsList.find((field) => field.name === fieldName);
  });
}
