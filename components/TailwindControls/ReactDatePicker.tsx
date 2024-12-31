import React, { ForwardedRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconInsideInputBox, IconLocation } from "./IconInsideInputBox";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "./SupportedLabelLocations";
// import { paramCase } from "change-case";

export type DatePickerProps = {
  name: string;
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  rightIconClick?: () => void;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (
    date: Date | null,
    event: React.SyntheticEvent<any> | undefined
  ) => void;
  value?: string | Date;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  editMode?: boolean;
};

function ReactDatePicker(
  {
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    disabled = false,
    required = false,
    editMode = false,
  }: DatePickerProps,
  ref: ForwardedRef<HTMLInputElement> | null
) {
  const { values } = useFormikContext<Record<string, string>>();

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

  const borderClass = isValid ? "border-vryno-gray" : "border-red-300";
  const focusBorderClass = isValid
    ? "focus:border-green-700"
    : "focus:border-red-700";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";

  return (
    <div className={`flex ${divFlexCol} `}>
      <label
        htmlFor={(name)}
        className={`mb-1 text-md tracking-wide ${labelClasses}`}
      >
        {label}
        {required && <span className="font-medium">*</span>}
      </label>
      <div className={`relative z-[2000] ${textBoxClasses}`}>
        {leftIcon && IconInsideInputBox(leftIcon, IconLocation.Left)}
        <DatePicker
          id={(name)}
          name={name}
          onChange={onChange}
          selected={
            editMode
              ? editMode && values[name]
                ? new Date(values[name])
                : null
              : null
          }
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          yearDropdownItemNumber={60}
          showYearDropdown
          scrollableYearDropdown
          onBlur={onBlur}
          placeholderText={placeholder}
          disabled={disabled}
          className={`text-sm 
                    border
                    ${borderClass}
                    relative
                    w-full rounded-sm
                    placeholder-gray-500 
                    ${focusBorderClass}
                    focus:shadow-md
                    focus:outline-none 
                    py-2 
                    ${paddingRightClass}
                    ${paddingLeftClass}`}
        />
        {rightIcon &&
          IconInsideInputBox(rightIcon, IconLocation.Right, rightIconClick)}
      </div>
      {!isValid && error && (
        <label className="text-red-600 ml-2 mt-1 text-sm ">{error}</label>
      )}
    </div>
  );
}

export default React.forwardRef(ReactDatePicker);
