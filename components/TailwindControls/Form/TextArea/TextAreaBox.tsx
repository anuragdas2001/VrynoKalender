import React, { LegacyRef } from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { kebabCase } from "change-case";
import { useFormikContext } from "formik";
import RequiredIndicator from "../Shared/RequiredIndicator";

export type TextAreaBoxProps = {
  name: string;
  placeholder?: string;
  label?: string;
  reference?: LegacyRef<HTMLTextAreaElement> | undefined;
  rightIconClick?: () => void;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onFocusCapture?: () => void;
  onKeyUpCapture?: () => void;
  onKeyDownCapture?: () => void;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  allowMargin?: boolean;
  externalExpressionToCalculateValue?: string;
  maxCharLength?: number;
  rejectRequired?: boolean;
  addClear?: boolean;
  externalError?: string;
  paddingInPixelForInputBox?: number;
  fontStyle?: string;
  lineHeightStyle?: string;
  fontFamilyStyle?: string;
  dataTestId?: string;
  hideValidationMessages?: boolean;
};

function TextAreaBox(
  {
    placeholder = "",
    label,
    reference,
    // rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    onFocusCapture = () => {},
    onKeyDownCapture = () => {},
    onKeyUpCapture = () => {},
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    disabled = false,
    required = false,
    rows = 1,
    allowMargin = true,
    // externalExpressionToCalculateValue,
    maxCharLength,
    rejectRequired,
    addClear,
    externalError,
    paddingInPixelForInputBox,
    fontStyle,
    lineHeightStyle,
    fontFamilyStyle,
    dataTestId,
    hideValidationMessages,
  }: TextAreaBoxProps,
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);
  const paddingLeftClass = "pl-2";
  const paddingRightClass = "pr-2";
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";

  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-2"} `}>
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={kebabCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses} flex items-center`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              ref={ref}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, "");
                  setFormDisabled(false);
                  return;
                }
                setFieldValue(name, null);
                setFormDisabled(true);
              }}
              className="cursor-pointer mr-1.5"
            />
            <label htmlFor={`clear-${name}`} className="cursor-pointer text-xs">
              clear
            </label>
          </div>
        )}
      </div>
      <div className={`relative ${textBoxClasses}`}>
        <textarea
          id={kebabCase(name)}
          data-testid={dataTestId ? kebabCase(dataTestId) : kebabCase(name)}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          onFocusCapture={onFocusCapture}
          placeholder={value ? value : placeholder}
          value={value ? value : ""}
          disabled={formDisabled}
          ref={reference}
          rows={rows}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
            }
            onKeyDownCapture();
          }}
          onKeyUpCapture={onKeyUpCapture}
          className={`border ${
            paddingInPixelForInputBox
              ? `py-[${paddingInPixelForInputBox}px]`
              : "py-2"
          } min-h-[40px] relative w-full rounded-md ${
            fontStyle ? fontStyle : "text-sm"
          } placeholder-vryno-placeholder focus:shadow-md focus:outline-none
              ${borderClass} ${focusBorderClass} ${paddingRightClass} ${paddingLeftClass} `}
          style={{
            fontSize: fontStyle ? fontStyle : "14px",
            lineHeight: lineHeightStyle ? lineHeightStyle : "21px",
            fontFamily: fontFamilyStyle,
          }}
        />
        {maxCharLength && (
          <span
            className={`w-full flex justify-end text-xs text-gray-500`}
          >{`(${values[name]?.length ?? 0}/${maxCharLength})`}</span>
        )}
      </div>
      {hideValidationMessages ? (
        <></>
      ) : rejectRequired ? (
        !isValid || (error && !error?.includes("required")) ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        ) : (
          <></>
        )
      ) : externalError ? (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {externalError}
        </label>
      ) : (
        !isValid &&
        error && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        )
      )}
    </div>
  );
}

export default React.forwardRef(TextAreaBox);
