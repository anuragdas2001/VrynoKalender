import { useFormikContext } from "formik";
import React from "react";
import { getCountryCodeFromPreference } from "../../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IUserPreference } from "../../../../../../models/shared";

export type FilterFieldPerOperatorPerDatatypeType = {
  name: string;
  modelName: string;
  disabled: boolean;
  selectedField: ICustomField;
  userPreferences: IUserPreference[];
};

export const FilterFieldPerOperatorPerDatatype = ({
  name,
  modelName,
  disabled,
  selectedField,
  userPreferences,
}: FilterFieldPerOperatorPerDatatypeType) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);

  return (
    <>
      {(values[`operator${name}`]?.includes("d_") ||
      values[`operator${name}`]?.includes("is_") ||
      values[`operator${name}`] === "any_value" ? (
        <></>
      ) : selectedField &&
        ["lookup", "multiSelectLookup"].includes(selectedField?.dataType) &&
        ["ilike", "stwth", "endwth"].includes(values[`operator${name}`]) ? (
        <FormInputBox
          name={`value${name}`}
          placeholder="Value"
          disabled={disabled}
          allowMargin={false}
          id={`value${name}`}
          modelName={modelName}
          paddingInPixelForInputBox={4}
        />
      ) : values[`operator${name}`]?.includes("pt_") ||
        values[`operator${name}`]?.includes("ft_") ? (
        <FormInputBox
          type={"number"}
          name={`value${name}`}
          placeholder="Value"
          disabled={disabled}
          allowMargin={false}
          id={`value${name}`}
          modelName={modelName}
          paddingInPixelForInputBox={4}
        />
      ) : values[`operator${name}`] === "between" && selectedField ? (
        <div className="flex flex-col gap-y-2">
          {selectedField.dataType === "expression" ? (
            <FormInputBox
              name={`value${name}`}
              placeholder="Value"
              disabled={disabled}
              allowMargin={false}
              type="number"
              id={`value${name}`}
              paddingInPixelForInputBox={4}
            />
          ) : (
            <FormFieldPerDataType
              fieldName={`value${name}-between-start`}
              id={`value${name}-between-start`}
              field={{ ...selectedField, name: `value${name}-between-start` }}
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName}
              editMode={false}
              values={values}
              showLabel={false}
              allowMargin={false}
              disabled={disabled}
              countryCodeInUserPreference={countryCodeInUserPreference}
              paddingInPixelForInputBox={4}
            />
          )}
          {!selectedField ? (
            <></>
          ) : selectedField.dataType === "expression" ? (
            <FormInputBox
              name={`value${name}`}
              placeholder="Value"
              disabled={disabled}
              allowMargin={false}
              type="number"
              id={`value${name}`}
              paddingInPixelForInputBox={4}
            />
          ) : (
            <FormFieldPerDataType
              fieldName={`value${name}-between-end`}
              id={`value${name}-between-end`}
              field={{ ...selectedField, name: `value${name}-between-end` }}
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName}
              editMode={false}
              values={values}
              showLabel={false}
              allowMargin={false}
              disabled={disabled}
              countryCodeInUserPreference={countryCodeInUserPreference}
              paddingInPixelForInputBox={4}
            />
          )}
        </div>
      ) : (
        selectedField &&
        selectedField.dataType !== "expression" && (
          <FormFieldPerDataType
            fieldName={`value${name}`}
            id={`value${name}`}
            field={{ ...selectedField, name: `value${name}` }}
            isSample={false}
            setFieldValue={setFieldValue}
            modelName={modelName}
            editMode={false}
            values={values}
            showLabel={false}
            allowMargin={false}
            disabled={disabled}
            countryCodeInUserPreference={countryCodeInUserPreference}
            paddingInPixelForInputBox={4}
            autoOpenSearchScreenContainer={true}
          />
        )
      )) || (
        <FormInputBox
          name={`value${name}`}
          placeholder="Value"
          disabled={disabled || selectedField.dataType !== "expression"}
          allowMargin={false}
          type={selectedField.dataType === "expression" ? "number" : "text"}
          paddingInPixelForInputBox={4}
        />
      )}
    </>
  );
};
