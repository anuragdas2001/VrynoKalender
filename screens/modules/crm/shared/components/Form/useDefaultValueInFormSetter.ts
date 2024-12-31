import { useEffect } from "react";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormikErrors } from "formik";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";

export function useDefaultValueInFormSetter(
  editMode: boolean,
  formResetted: boolean | undefined,
  fieldList: ICustomField[],
  formFieldsList: ICustomField[],
  customFieldsData: Record<string, Record<string, string>> | undefined,
  setHasRelatedTo: (value: boolean) => void,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Record<string, string>>>
) {
  useEffect(() => {
    if (fieldList.length) {
      for (let i = 0; i < fieldList.length; i++) {
        if (
          fieldList[i].dataType === "relatedTo" &&
          fieldList[i].systemDefined === true &&
          fieldList[i].visible === true &&
          fieldList[i].readOnly === false
        ) {
          setHasRelatedTo(true);
          break;
        }
      }
    }
    if (!editMode && fieldList.length) {
      const ownerField = fieldList.filter(
        (field) => field.name === "ownerId" && field.systemDefined
      );
      if (ownerField.length) {
        setFieldValue(ownerField[0].name, cookieUserStore.getUserId());
      }
    }
    if (editMode && customFieldsData && Object.keys(customFieldsData).length) {
      for (const [key, value] of Object.entries(customFieldsData)) {
        setFieldValue(key, value);
      }
    }
  }, [fieldList]);

  useEffect(() => {
    if (!editMode && formFieldsList.length && formResetted) {
      const ownerField = formFieldsList.filter(
        (field) => field.name === "ownerId" && field.systemDefined
      );
      if (ownerField.length) {
        setFieldValue(ownerField[0].name, cookieUserStore.getUserId());
      }
    }
  }, [formResetted]);
}
