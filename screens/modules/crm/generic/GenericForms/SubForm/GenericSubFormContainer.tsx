import React from "react";
import { SubFormContent } from "./SubFormContent";
import { ISubFormDataDict } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";

export const GenericSubFormContainer = ({
  appName,
  modelName,
  subFormDataDict,
  editMode,
  formDetails,
  editData,
  countryCodeInUserPreference,
  isSample,
  subFormRefs,
  data,
  subFormFieldsListDict,
  setSubFormDataDict,
  id,
  saveNext,
  subFormClear,
  setSubFormValidationErrors,
  subFormValidationErrors,
}: {
  appName: string | undefined;
  modelName: string | undefined;
  subFormDataDict: ISubFormDataDict[];
  editMode: boolean;
  formDetails: {
    type: string;
    modelName: string;
    appName: string;
  };
  editData: Record<string, string | Record<string, Record<string, string>>>;
  countryCodeInUserPreference: string;
  isSample: boolean;
  subFormRefs: any;
  data: any;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
  setSubFormDataDict: (value: ISubFormDataDict[]) => void;
  id: string | undefined;
  saveNext: boolean | undefined;
  subFormClear: boolean;
  setSubFormValidationErrors: (value: Record<string, boolean>) => void;
  subFormValidationErrors: Record<string, boolean>;
}) => {
  const cookieUser = cookieUserStore.getUserDetails();
  return (
    <>
      {subFormDataDict.map((subFormData, subFormIndex) => {
        if (subFormData.fieldsList?.length) {
          const updatedFieldsList = subFormData.fieldsList;
          return (
            <SubFormContent
              appName={appName}
              modelName={modelName}
              key={subFormIndex}
              subFormIndex={subFormIndex}
              subFormData={subFormData}
              updatedFieldsList={updatedFieldsList}
              editMode={editMode}
              formDetails={formDetails}
              countryCodeInUserPreference={countryCodeInUserPreference}
              isSample={isSample}
              subFormRefs={subFormRefs}
              data={data}
              subFormFieldsListDict={subFormFieldsListDict}
              subFormDataDict={subFormDataDict}
              setSubFormDataDict={setSubFormDataDict}
              id={id}
              cookieUser={cookieUser}
              subFormClear={subFormClear}
              setSubFormValidationErrors={setSubFormValidationErrors}
              subFormValidationErrors={subFormValidationErrors}
            />
          );
        } else return <></>;
      })}
    </>
  );
};
