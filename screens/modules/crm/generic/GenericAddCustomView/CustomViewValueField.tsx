import React from "react";
import { useFormikContext } from "formik";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../models/shared";
import { FormFieldPerDataType } from "../../shared/components/Form/FormFieldPerDataType";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { getCountryCodeFromPreference } from "../../shared/components/Form/FormFields/FormFieldPhoneNumber";

export const CustomViewValueField = ({
  index,
  selectedField,
  fieldLabel,
  conditionList,
  modelName,
  editMode,
  condition,
  convertToBoolean,
  disabled,
  uniqueCustomName,
  userPreferences,
  disableDatatypeMetadataModification = false,
}: {
  index: number;
  selectedField: ICustomField[];
  fieldLabel?: string;
  conditionList: ICriteriaFilterRow[];
  modelName: string;
  editMode: boolean;
  condition?: ICriteriaFilterRow;
  convertToBoolean: boolean;
  disabled: boolean;
  uniqueCustomName: string;
  userPreferences: IUserPreference[];
  disableDatatypeMetadataModification?: boolean;
}) => {
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
      {(values[`operator${uniqueCustomName}${index}`]?.includes("d_") ||
      values[`operator${uniqueCustomName}${index}`]?.includes("is_") ||
      values[`operator${uniqueCustomName}${index}`] === "any_value" ? (
        <></>
      ) : selectedField?.[index] &&
        ["lookup", "multiSelectLookup"].includes(
          selectedField[index]?.dataType
        ) &&
        ["ilike", "stwth", "endwth"].includes(
          values[`operator${uniqueCustomName}${index}`]
        ) ? (
        <FormInputBox
          name={`value${uniqueCustomName}${index}`}
          placeholder="Value"
          disabled={disabled}
          allowMargin={false}
          id={conditionList[index][`fieldName${uniqueCustomName}`] as string}
          modelName={modelName}
          useExpression={false}
        />
      ) : values[`operator${uniqueCustomName}${index}`]?.includes("pt_") ||
        values[`operator${uniqueCustomName}${index}`]?.includes("ft_") ? (
        <FormInputBox
          type={"number"}
          name={`value${uniqueCustomName}${index}`}
          placeholder="Value"
          disabled={disabled}
          allowMargin={false}
          id={conditionList[index][`fieldName${uniqueCustomName}`] as string}
          modelName={modelName}
          useExpression={false}
        />
      ) : values[`operator${uniqueCustomName}${index}`] === "between" &&
        selectedField &&
        selectedField[index] &&
        conditionList[index][`fieldName${uniqueCustomName}`] ? (
        <>
          {selectedField[index].dataType === "expression" ? (
            <FormInputBox
              name={`value${uniqueCustomName}${index}-between-start`}
              placeholder="Value"
              disabled={disabled}
              allowMargin={false}
              type="number"
              useExpression={false}
            />
          ) : (
            <FormFieldPerDataType
              fieldName={`value${uniqueCustomName}${index}-between-start`}
              index={index}
              id={
                conditionList[index][`fieldName${uniqueCustomName}`] as string
              }
              field={
                disableDatatypeMetadataModification
                  ? selectedField[index]
                  : selectedField[index]?.dataTypeMetadata?.type === "string" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "stringLookup" }
                  : selectedField[index]?.dataTypeMetadata?.type === "record" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "recordLookup" }
                  : selectedField[index]?.dataTypeMetadata?.type === "lookup" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "lookup" }
                  : selectedField[index]
              }
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName}
              editMode={editMode}
              values={values}
              showLabel={false}
              allowMargin={false}
              disabled={disabled}
              convertToBoolean={convertToBoolean}
              countryCodeInUserPreference={countryCodeInUserPreference}
              useExpression={false}
              fieldLabel={fieldLabel}
            />
          )}
          {!selectedField?.[index] ? (
            <></>
          ) : selectedField[index].dataType === "expression" ? (
            <FormInputBox
              name={`value${uniqueCustomName}${index}-between-end`}
              placeholder="Value"
              disabled={disabled}
              allowMargin={false}
              type="number"
              useExpression={false}
            />
          ) : (
            <FormFieldPerDataType
              fieldName={`value${uniqueCustomName}${index}-between-end`}
              index={index}
              id={
                conditionList[index][`fieldName${uniqueCustomName}`] as string
              }
              field={
                disableDatatypeMetadataModification
                  ? selectedField[index]
                  : selectedField[index]?.dataTypeMetadata?.type === "string" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "stringLookup" }
                  : selectedField[index]?.dataTypeMetadata?.type === "record" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "recordLookup" }
                  : selectedField[index]?.dataTypeMetadata?.type === "lookup" &&
                    values[`operator${uniqueCustomName}${index}`] === "eq"
                  ? { ...selectedField[index], dataType: "lookup" }
                  : selectedField[index]
              }
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName}
              editMode={editMode}
              values={values}
              showLabel={false}
              allowMargin={false}
              disabled={disabled}
              convertToBoolean={convertToBoolean}
              countryCodeInUserPreference={countryCodeInUserPreference}
              useExpression={false}
              fieldLabel={fieldLabel}
            />
          )}
        </>
      ) : (
        selectedField &&
        selectedField[index] &&
        conditionList[index][`fieldName${uniqueCustomName}`] &&
        selectedField[index].dataType !== "expression" && (
          <FormFieldPerDataType
            fieldName={`value${uniqueCustomName}${index}`}
            index={index}
            id={conditionList[index][`fieldName${uniqueCustomName}`] as string}
            field={
              disableDatatypeMetadataModification
                ? selectedField[index]
                : selectedField[index]?.dataTypeMetadata?.type === "string" &&
                  values[`operator${uniqueCustomName}${index}`] === "eq"
                ? { ...selectedField[index], dataType: "stringLookup" }
                : selectedField[index]?.dataTypeMetadata?.type === "record" &&
                  values[`operator${uniqueCustomName}${index}`] === "eq"
                ? { ...selectedField[index], dataType: "recordLookup" }
                : selectedField[index]?.dataTypeMetadata?.type === "lookup" &&
                  values[`operator${uniqueCustomName}${index}`] === "eq"
                ? { ...selectedField[index], dataType: "lookup" }
                : selectedField[index]
            }
            isSample={false}
            setFieldValue={setFieldValue}
            modelName={modelName}
            editMode={editMode}
            values={values}
            showLabel={false}
            allowMargin={false}
            disabled={disabled}
            convertToBoolean={convertToBoolean}
            countryCodeInUserPreference={countryCodeInUserPreference}
            useExpression={false}
            fieldLabel={fieldLabel}
          />
        )
      )) || (
        <FormInputBox
          name={`value${uniqueCustomName}${index}`}
          placeholder="Value"
          disabled={
            disabled ||
            (selectedField?.[index]?.dataType !== "expression" &&
              !condition?.[`operator${uniqueCustomName}`])
          }
          allowMargin={false}
          type={
            selectedField?.[index]?.dataType === "expression"
              ? "number"
              : "text"
          }
          useExpression={false}
        />
      )}
    </>
  );
};
