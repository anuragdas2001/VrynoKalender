import { ICustomField } from "../../../../../../../models/ICustomField";

export const getFieldsWithOrder = (fieldList: ICustomField[]) => {
  const fieldsWithOrder: {
    fieldName: string;
    order: number;
    dataType: string;
    visible: boolean;
    addInForm: boolean;
    readOnly: boolean;
  }[] = [];
  fieldList.forEach(
    (field: ICustomField, index: number) =>
      (fieldsWithOrder[index] = {
        fieldName: field.name,
        order:
          ["createdAt", "createdBy", "updatedAt", "updatedBy"].includes(
            field.name
          ) && field.systemDefined
            ? Infinity
            : field.order,
        dataType: field.dataType,
        visible: field.visible,
        readOnly: field.readOnly,
        addInForm: field.addInForm,
      })
  );
  return fieldsWithOrder;
};
