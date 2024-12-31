import { paramCase } from "change-case";
import { useFormikContext } from "formik";
import React, { ForwardedRef, useEffect, useState } from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";

export type MultipleValuesInputBoxProps = {
  name: string;
  placeholder?: string;
  type: string;
  label?: string;
  editMode?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  rightIconClick?: () => void;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  usedInForm?: boolean;
  dataTypeChanged?: boolean;
  onDataTypeChange?: () => void;
};

function MultipleValuesInputBox(
  {
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
    type,
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    editMode = false,
    disabled = false,
    required = false,
    multiple = true,
    usedInForm = true,
    dataTypeChanged = false,
    onDataTypeChange = () => {},
    ...props
  }: MultipleValuesInputBoxProps,
  ref: ForwardedRef<HTMLInputElement> | null
) {
  const paddingLeftClass = leftIcon ? "pl-12" : "pl-2";
  const paddingRightClass = rightIcon ? "pr-12" : "pr-2";
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";

  const borderClass = isValid
    ? "border-vryno-form-border-gray"
    : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [currentValue, setCurrentValue] = React.useState("");
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  const [editModeValues, setEditModeValues] = useState<Record<string, string>>(
    {}
  );

  const handleKeyDown = (evt: any) => {
    if (["Enter"].includes(evt.code)) {
      if (currentValue.length) {
        const resultValues = {
          ...selectedValues,
          ...editModeValues,
          ...{ [currentValue]: currentValue },
        };
        setSelectedValues({
          ...selectedValues,
          ...{ [currentValue]: currentValue },
        });
        setCurrentValue("");
        setFieldValue("lookup", "");
        setFieldValue(name, resultValues);
      }
    }
  };

  const handleUnselectedItem = (item: string) => {
    let remainingValues: any = {};
    let remainingKeys = Object.keys(selectedValues).filter(
      (key) => key !== item
    );
    remainingKeys.forEach((value: string) => {
      remainingValues[value] = selectedValues[value];
    });
    setSelectedValues(remainingValues);
    setFieldValue(
      name,
      multiple ? { ...remainingValues, ...editModeValues } : null
    );
  };

  useEffect(() => {
    if (values[name] && editMode) {
      setEditModeValues({ ...(values as any)[name] });
    }
    if (dataTypeChanged) {
      setSelectedValues({});
      onDataTypeChange();
    }
  }, [editMode, dataTypeChanged]);

  return (
    <>
      <div className={`flex ${divFlexCol} ${usedInForm ? "my-4" : ""}`}>
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
          >
            {label}
          </label>
        )}
        <div
          className={`relative ${textBoxClasses} 
          focus:shadow-md
          border
          ${borderClass}
          ${focusBorderClass}
          rounded-md text-sm break-words`}
        >
          <div
            className={`${
              Object.keys(editModeValues).length ? "mx-2" : "hidden"
            } ${
              !multiple && Object.keys(editModeValues).length
                ? "py-3.5"
                : "mt-2"
            }`}
          >
            {Object.keys(editModeValues)?.map((key, index) => (
              <span
                className={`bg-vryno-select-bg px-2 rounded-lg mr-2`}
                key={index}
              >
                <span
                  className={`break-all `}
                  style={{ color: "#7087A7" }}
                >{`${editModeValues[key]}`}</span>
              </span>
            ))}
          </div>
          <div
            className={`${
              Object.keys(selectedValues).length ? "mx-2" : "hidden"
            } ${
              !multiple && Object.keys(selectedValues).length
                ? "py-3.5"
                : "mt-2"
            }`}
          >
            {Object.keys(selectedValues)?.map((key, index) => (
              <span
                className={`bg-vryno-select-bg px-2 rounded-lg mr-2`}
                key={index}
              >
                <span
                  className={`break-all `}
                  style={{ color: "#7087A7" }}
                >{`${selectedValues[key]}`}</span>

                <span
                  className="ml-2 text-red-400 cursor-pointer"
                  onClick={() => handleUnselectedItem(key)}
                >
                  x
                </span>
              </span>
            ))}
          </div>
          <input
            autoComplete="new-password"
            id={paramCase(name)}
            type={type}
            name={"lookup"}
            placeholder={`Please type and press enter..`}
            disabled={disabled}
            value={currentValue}
            className={` 
            relative
            w-full       
            py-2 
            placeholder-vryno-placeholder
            ${paddingRightClass}
            ${paddingLeftClass} 
            outline-none
            rounded-md ${
              !multiple && Object.keys(selectedValues)?.length ? "hidden" : ""
            }
            `}
            onChange={(e) => {
              setCurrentValue(e.currentTarget.value);
            }}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </div>
        {!isValid && error && (
          <label className="text-red-600 ml-2 mt-1 text-xs">{error}</label>
        )}
      </div>
    </>
  );
}

export default React.forwardRef(MultipleValuesInputBox);
