import { ICustomField } from "../../../../../../models/ICustomField";
import { ICustomView } from "../../../../../../models/shared";

export const calculateCurrentCustomModuleViewFields = (
  fieldsList: ICustomField[],
  currentModuleViewId: string | undefined,
  customModuleViewData: ICustomView[]
) => {
  let currentCustomModuleView = customModuleViewData?.filter(
    (item) => item.id === currentModuleViewId
  );
  let currentCustomModuleViewFieldsList =
    currentCustomModuleView && currentCustomModuleView.length > 0
      ? currentCustomModuleView[0].moduleFields
      : [];
  return currentCustomModuleViewFieldsList.map((item) => {
    return fieldsList.filter(
      (field) => field.name === item.replace("fields.", "")
    )[0];
  });
};
