import { ICustomField } from "./../../../../models/ICustomField";

export const rightFieldInSectionFieldListFunc = (
  findFieldIndexInSectionFieldListWithOrder?: number,
  sectionFieldListWithOrder?: {
    fieldName: string;
    order: number;
    dataType: string;
  }[],
  sectionFieldList?: ICustomField[]
) => {
  if (
    !sectionFieldListWithOrder ||
    !sectionFieldList ||
    findFieldIndexInSectionFieldListWithOrder ===
      sectionFieldListWithOrder?.length - 1 ||
    findFieldIndexInSectionFieldListWithOrder === -1 ||
    sectionFieldList?.length <= 0
  )
    return undefined;

  if (typeof findFieldIndexInSectionFieldListWithOrder !== "number")
    return undefined;

  const rightFieldList = sectionFieldList?.filter((sectionField) => {
    if (
      sectionFieldListWithOrder[findFieldIndexInSectionFieldListWithOrder + 1]
        ?.dataType === "relatedTo"
    ) {
      if (
        sectionField.name ===
        sectionFieldListWithOrder[findFieldIndexInSectionFieldListWithOrder + 2]
          ?.fieldName
      )
        return sectionField;
    }
    if (
      sectionField.name ===
      sectionFieldListWithOrder[findFieldIndexInSectionFieldListWithOrder + 1]
        ?.fieldName
    )
      return sectionField;
  });
  if (rightFieldList?.length > 0) return rightFieldList[0];
  else return undefined;
};
