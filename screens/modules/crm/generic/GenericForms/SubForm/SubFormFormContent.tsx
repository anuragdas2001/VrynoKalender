import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { BaseUser } from "../../../../../../models/Accounts";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";
import { debounce, isEqual } from "lodash";

export const SubFormFormContent = ({
  subFormItem,
  updatedFieldsList,
  isSample,
  modelName,
  editMode,
  countryCodeInUserPreference,
  subFormFormikValues,
  setSubFormFormikValues,
  cookieUser,
  subFormClear,
  setSubFormValidationErrors,
  subFormValidationErrors,
}: {
  subFormItem: Record<string, any>;
  updatedFieldsList: ICustomField[];
  isSample: boolean;
  modelName: string | undefined;
  editMode: boolean;
  countryCodeInUserPreference: string;
  subFormFormikValues: Record<string, FormikValues>;
  setSubFormFormikValues: (value: Record<string, FormikValues>) => void;
  cookieUser: BaseUser | null;
  subFormClear: boolean;
  setSubFormValidationErrors: (value: Record<string, boolean>) => void;
  subFormValidationErrors: Record<string, boolean>;
}) => {
  const { values, setFieldValue, resetForm, errors, touched } =
    useFormikContext<Record<string, string>>();

  React.useEffect(() => {
    // !editMode
    if (updatedFieldsList.length) {
      const ownerField = updatedFieldsList.filter(
        (field) => field.name === "ownerId" && field.systemDefined
      );
      if (ownerField.length && !values["ownerId"] && cookieUser) {
        setFieldValue(ownerField[0].name, cookieUser.id);
      }
    }
  }, [cookieUser]);

  const debouncedEffect = React.useCallback(
    debounce(() => {
      const filteredValues: FormikValues = {};
      for (const key in values) {
        if (values[key]) {
          filteredValues[key] = values[key];
        }
      }
      const subFormKey = Object.keys(subFormItem)[0];
      const currentSubFormValues = subFormFormikValues[subFormKey] || {};
      const isSubFormValuesChanged = !isEqual(
        filteredValues,
        currentSubFormValues
      );
      if (isSubFormValuesChanged) {
        setSubFormFormikValues({
          ...subFormFormikValues,
          [subFormKey]: filteredValues,
        });
      }
    }, 300),
    [values]
  );

  const errorDebouncedEffect = React.useCallback(
    debounce(() => {
      const subFormKey = Object.keys(subFormItem)[0];
      if (Object.keys(errors)?.length) {
        let hasError = false;
        for (const key in errors) {
          if (
            typeof errors[key] === "string" &&
            !errors[key]?.includes("required")
          ) {
            hasError = true;
            break;
          }
        }
        const updatedValues = { ...subFormValidationErrors };
        if (!hasError) delete updatedValues[subFormKey];
        else updatedValues[subFormKey] = hasError;
        setSubFormValidationErrors(updatedValues);
        // setSubFormValidationErrors({
        //   ...subFormValidationErrors,
        //   [subFormKey]: hasError,
        // });
      } else {
        if (subFormValidationErrors[subFormKey]) {
          const updatedValues = { ...subFormValidationErrors };
          delete updatedValues[subFormKey];
          setSubFormValidationErrors(updatedValues);
          // setSubFormValidationErrors({
          //   ...subFormValidationErrors,
          //   [subFormKey]: false,
          // });
        }
      }
    }, 50),
    [errors, values]
  );

  React.useEffect(() => {
    debouncedEffect();
    return () => {
      debouncedEffect.cancel();
    };
  }, [debouncedEffect]);

  React.useEffect(() => {
    errorDebouncedEffect();
    return () => {
      errorDebouncedEffect.cancel();
    };
  }, [errorDebouncedEffect]);

  React.useEffect(() => {
    if (subFormClear) {
      resetForm({});
    }
  }, [subFormClear]);

  return (
    <>
      {updatedFieldsList.map((field, index) => (
        <FormFieldPerDataType
          key={index}
          field={field}
          isSample={isSample}
          setFieldValue={setFieldValue}
          modelName={modelName || ""}
          editMode={editMode}
          values={values}
          countryCodeInUserPreference={countryCodeInUserPreference}
          formResetted={subFormClear}
          enableRichTextReinitialize={true}
        />
      ))}
    </>
  );
};

//   React.useEffect(() => {
//     if (
//       Object.keys(subFormFormikValues[Object.keys(subFormItem)[0]] || {})
//         ?.length === 0
//     ) {
//       for (const key in values) {
//         if (key === "ownerId") {
//           setFieldValue("ownerId", cookieUser?.id || null);
//         } else {
//           setFieldValue(key, null);
//         }
//       }
//     }
//   }, [subFormFormikValues]);
