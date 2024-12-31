import { useFormikContext } from "formik";
import React from "react";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";

export const LeadConversionConvertForm = ({
  fieldsList,
  id,
  moduleName,
  countryCodeInUserPreference,
  handleSelectedModule,
}: {
  fieldsList: ICustomField[];
  id: string;
  moduleName: string;
  countryCodeInUserPreference: string;
  handleSelectedModule: (name: string) => void;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  return (
    <div
      className="mt-4 p-6 rounded-md bg-vryno-header-color grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 overflow-visible"
      onClick={() => handleSelectedModule(moduleName)}
    >
      {fieldsList
        .filter((field) => field.name !== "ownerId")
        .flatMap((field: ICustomField, index) => {
          return (
            <FormFieldPerDataType
              key={index}
              field={field}
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={moduleName}
              editMode={false}
              id={id}
              values={values}
              countryCodeInUserPreference={countryCodeInUserPreference}
            />
          );
        })}
    </div>
  );
};
