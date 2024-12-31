import { ICustomField } from "../../../../../../models/ICustomField";
import { toJS } from "mobx";

export const getUpdatedFormFieldsListForDealStage = (
  formFieldsListData: ICustomField[],
  selectedDealStage: string[],
  stagesLookupOptions: any[]
): ICustomField[] => {
  const dealStageIdFieldIndex = formFieldsListData.findIndex(
    (field) => field.name === "dealStageId" && field.systemDefined
  );

  if (dealStageIdFieldIndex === -1) {
    return formFieldsListData;
  }

  const dealStageField = formFieldsListData[dealStageIdFieldIndex];
  const updatedLookupOptions = selectedDealStage
    ?.map((stage: string, index: number) => {
      const findIndex = stagesLookupOptions?.findIndex(
        (lookupOption) => lookupOption?.id === stage
      );
      if (findIndex === -1) {
        return null;
      }
      const plainObj = toJS(stagesLookupOptions[findIndex]);
      //this is important, Since this ensure the order of the lookup options
      plainObj.order = index;
      return plainObj;
    })
    ?.filter((field) => field);

  const updatedFormFieldsList: ICustomField[] = formFieldsListData.filter(
    (_, index) => index !== dealStageIdFieldIndex
  );

  updatedFormFieldsList.push({
    ...dealStageField,
    dataTypeMetadata: {
      ...dealStageField.dataTypeMetadata,
      lookupOptions: updatedLookupOptions,
    },
  });
  return updatedFormFieldsList;
};
