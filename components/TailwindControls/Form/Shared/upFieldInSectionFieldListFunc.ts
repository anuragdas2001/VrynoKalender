import { SectionDetailsType } from "../../../../screens/modules/crm/generic/GenericForms/Shared/genericFormProps";
import { ICustomField } from "./../../../../models/ICustomField";

export const upFieldInSectionFieldListFunc = (
  sectionDetails?: SectionDetailsType,
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
      sectionFieldListWithOrder?.length ||
    findFieldIndexInSectionFieldListWithOrder === -1 ||
    sectionFieldList?.length <= 0
  )
    return undefined;

  if (typeof findFieldIndexInSectionFieldListWithOrder !== "number")
    return undefined;

  const upFieldList = sectionFieldList?.filter((sectionField) => {
    if (
      sectionFieldListWithOrder[
        findFieldIndexInSectionFieldListWithOrder -
          Number(sectionDetails?.columnLayout)
      ]?.dataType === "relatedTo"
    ) {
      if (
        sectionField.name ===
        sectionFieldListWithOrder[
          findFieldIndexInSectionFieldListWithOrder -
            Number(sectionDetails?.columnLayout) -
            1
        ]?.fieldName
      )
        return sectionField;
    } else if (
      sectionField.name ===
      sectionFieldListWithOrder[
        findFieldIndexInSectionFieldListWithOrder -
          Number(sectionDetails?.columnLayout)
      ]?.fieldName
    )
      return sectionField;
  });

  if (upFieldList?.length > 0) return upFieldList[0];
  else return undefined;
};
