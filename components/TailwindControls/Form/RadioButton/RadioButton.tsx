import { paramCase } from "change-case";
import React, { useCallback } from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { useFormikContext } from "formik";

export type RadioButtonProps = {
  name: string;
  placeholder?: string;
  autoComplete?: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  value?: string;
  type?: "radio" | "checkbox";
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  allowMargin?: boolean;
  helpText?: React.ReactElement;
  options: {
    value: string;
    label: string | React.ReactElement;
    render?: React.ReactElement;
  }[];
  showOptionsInRow?: boolean;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
};

const RadioButton = (
  {
    placeholder = "",
    label,
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    disabled = false,
    required = false,
    type = "radio",
    helpText,
    allowMargin = true,
    autoComplete = "on",
    options = [],
    showOptionsInRow = false,
    onBlur = () => {},
    onChange = () => {},
  }: RadioButtonProps,
  ref: React.Ref<any>
) => {
  const { values } = useFormikContext<Record<string, string>>();
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6 flex mb-0"
      : "";

  return (
    <div
      className={`flex ${divFlexCol} ${allowMargin && "my-4"}`}
      data-control-type="input-box"
    >
      {label && (
        <label
          className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray  ${labelClasses}`}
        >
          {label}
          <RequiredIndicator required={required} />
        </label>
      )}
      <div
        className={`flex ${showOptionsInRow ? "gap-x-4 mt-2" : "flex-col"} `}
      >
        {options?.map((option, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center mb-1.5">
              <input
                id={option.value}
                name={name}
                type={type}
                onChange={(e: React.ChangeEvent<any>) => {
                  onChange(e);
                }}
                onBlur={onBlur}
                value={option.value}
                disabled={disabled}
                checked={values[name] === option.value}
                autoComplete={autoComplete}
                className={`${type === "checkbox" ? "" : " w-5 h-5"} ${
                  disabled ? "" : "cursor-pointer"
                } `}
              />
              {typeof option.label == "string" ? (
                <label
                  htmlFor={option.value}
                  className={`text-sm text-vryno-icon ml-2 ${
                    disabled ? "" : "cursor-pointer"
                  }`}
                >
                  {option.label}
                </label>
              ) : (
                <div
                  className={`text-sm text-vryno-icon ml-2 ${
                    disabled ? "" : "cursor-pointer"
                  }`}
                >
                  {option.label}
                </div>
              )}
            </div>
            {values[name] === option.value && option.render ? (
              <div className="w-full h-full px-4 py-2">{option.render}</div>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </div>
      {helpText}
      {!isValid && error && (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {error}
        </label>
      )}
    </div>
  );
};

export default React.forwardRef(RadioButton);
