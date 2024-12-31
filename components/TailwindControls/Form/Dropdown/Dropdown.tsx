import React from "react";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
// import { kebabCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { GetOptionsJSX } from "./OptionsJSX";
import Button from "../Button/Button";
import CloseLineIcon from "remixicon-react/CloseLineIcon";

export type DropdownProps = {
  name: string;
  type?: string;
  dropdownType?: "thin" | "normal";
  placeholder?: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  showLabel?: boolean;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  kind?: "normal" | "primary" | "gray";
  value?: string;
  val?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  options?: Partial<
    Array<{
      label: string;
      value: string | null;
      visible?: boolean;
      extraInfoField?: boolean;
      colourHex?: string;
      defaultOption?: boolean;
    }>
  >;
  optionGroups?: {
    [groupLabel: string]: Partial<
      Array<{
        label: string;
        value: string | null;
        visible?: boolean;
        extraInfoField?: boolean;
      }>
    >;
  };
  stopEventPropagation?: boolean;
  onClick?: () => void;
  additionalComponent?: React.ReactElement;
  editMode?: boolean;
  color?: string;
  dropdownTextColor?: string;
  allowMargin?: boolean;
  externalExpressionToCalculateValue?: string;
  rejectRequired?: boolean;
  addClear?: boolean;
  externalStyle?: string;
  lookupDependencyFields?: Record<string, Record<string, string>>;
  handleDependencyLookupFiltering?: (
    parentField: string,
    parentLookup: string,
    childField: string
  ) => void;
  paddingInPixelForInputBox?: number;
  allowColourInValue?: boolean;
  setDefaultCurrency?: boolean;
  dataTestId?: string;
  hideValidationMessages?: boolean;
  disableAutoSelectOfSystemDefinedValues?: boolean;
};

function Dropdown({
  placeholder = "",
  label,
  name,
  dropdownType = "normal",
  value,
  showLabel = true,
  onBlur = () => {},
  onChange = () => {},
  labelLocation = SupportedLabelLocations.OnTop,
  options = [],
  disabled = false,
  required = false,
  editMode = false,
  kind = "normal",
  color = "",
  dropdownTextColor,
  allowMargin = true,
  externalStyle,
  rejectRequired,
  addClear,
  optionGroups,
  lookupDependencyFields,
  stopEventPropagation,
  handleDependencyLookupFiltering,
  paddingInPixelForInputBox,
  allowColourInValue = false,
  setDefaultCurrency = true,
  dataTestId,
  hideValidationMessages,
  disableAutoSelectOfSystemDefinedValues,
}: DropdownProps) {
  if (addClear && !required) {
    options = [{ label: "(clear)", value: "(clear)" }, ...options];
  }
  const { errors, touched, values, setFieldValue } = useFormikContext<Record<string, string>>();
  // const { errors, touched, values, setFieldValue } = useFormikContext();

  console.log(name);
  console.log(values)
  console.log(errors);
  console.log(touched);

  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";

  const borderClass =
    (touched[name] ? errors[name] === undefined : true) || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = (touched[name] ? errors[name] === undefined : true)
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";

  const selectElementPadding =
    dropdownType === "normal"
      ? `${
          paddingInPixelForInputBox
            ? `py-[${paddingInPixelForInputBox}px]`
            : "py-2"
        } px-2`
      : dropdownType === "thin"
      ? `${
          paddingInPixelForInputBox
            ? `py-[${paddingInPixelForInputBox}px]`
            : "py-1.5"
        } px-1`
      : "";

  React.useEffect(() => {
    if (disableAutoSelectOfSystemDefinedValues) return;
    if (
      !values[name] &&
      name === "currency" &&
      options?.length &&
      setDefaultCurrency
    ) {
      const USDExist = options.filter((option) => option?.label === "USD");
      if (USDExist?.length) setFieldValue(name, USDExist[0]?.value);
    }
  }, []);

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-2"} `}>
      <div className="flex justify-between">
        {label && showLabel && (
          <label
            htmlFor={(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
      </div>

      <div className={`relative ${textBoxClasses}`}>
        {values[name] && allowColourInValue ? (
          <div
            className={`${
              externalStyle
                ? externalStyle
                : `form-select appearance-none bg-clip-padding bg-no-repeat border relative pr-8 w-full rounded-md text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none
          ${borderClass} ${focusBorderClass} ${color} py-1.5 px-2
          ${
            kind === "primary"
              ? "bg-vryno-theme-light-blue text-white"
              : kind === "gray"
              ? "bg-gray-100"
              : "bg-white"
          }`
            } `}
          >
            <span
              className={`bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl inline-flex justify-center items-center text-xs`}
            >
              {options?.filter((option) => option?.value === values[name])
                ?.length > 0 &&
                options?.filter((option) => option?.value === values[name])[0]
                  ?.colourHex && (
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: `${
                        options?.filter(
                          (option) => option?.value === values[name]
                        )[0]?.colourHex
                      }`,
                    }}
                    data-testid={`${label}-${
                      options?.filter(
                        (option) => option?.value === values[name]
                      )[0]?.label
                    }-color`}
                  />
                )}
              <span className="pl-1">{`${
                options?.filter((option) => option?.value === values[name])[0]
                  ?.label
              }`}</span>
              <Button
                id="multiple-values-dropdown-close"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setFieldValue(name, null);
                }}
                customStyle=""
                userEventName="multiple-values-dropdown-close:action-click"
              >
                <CloseLineIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
              </Button>
            </span>
          </div>
        ) : (
          <select
            id={(name)}
            data-testid={dataTestId ? (dataTestId) : (name)}
            name={name}
            onClick={(e) => (stopEventPropagation ? e.stopPropagation() : {})}
            // onChange={(selectedOption) => {
            //   if (
            //     lookupDependencyFields &&
            //     Object.keys(lookupDependencyFields)?.length
            //   ) {
            //     for (const key in lookupDependencyFields) {
            //       if (name === key) 
            //         {
            //         handleDependencyLookupFiltering &&
            //           handleDependencyLookupFiltering(
            //             key,
            //             selectedOption.target.value,
            //             lookupDependencyFields[key].chidField
            //           );
            //       }
            //     }
            //     setFieldValue(name, selectedOption.target.value);
            //   } else {
            //     onChange(selectedOption);
            //   }
            // }}
            onChange={(selectedOption) => {
              console.log('inside dropdown onchange function',selectedOption);
              if (lookupDependencyFields && Object.keys(lookupDependencyFields)?.length) {
                for (const key in lookupDependencyFields) {
                  if (lookupDependencyFields.hasOwnProperty(key) && name === key) {
                    const childField = lookupDependencyFields[key]?.chidField;
            
                    if (childField && handleDependencyLookupFiltering) {
                      handleDependencyLookupFiltering(
                        key,
                        selectedOption.target.value,
                        childField
                      );
                    }
                  }
                }
                setFieldValue(name, selectedOption.target.value);
              } else {
                onChange(selectedOption);
              }
            }}





            onBlur={onBlur}
            // @ts-ignore
            placeholder={
              values[name] && options.length > 0
                ? options?.filter((option) => option?.value === values[name])[0]
                    ?.label
                : placeholder
            }
            value={values[name] ? values[name] : value ?? ""}
            disabled={
              disabled ||
              (options.length > 0 &&
                options.filter((option) => {
                  if (typeof option?.visible === "boolean") {
                    if (option.visible) return option;
                  } else return option;
                }).length === 0)
            }
            className={`${
              externalStyle
                ? externalStyle
                : `form-select appearance-none bg-clip-padding bg-no-repeat border relative pr-8 w-full rounded-md text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none
          ${borderClass} ${focusBorderClass} ${color} ${selectElementPadding}
          ${
            kind === "primary"
              ? "bg-vryno-theme-light-blue text-white"
              : kind === "gray"
              ? "bg-gray-100"
              : "bg-white"
          }`
            } `}
          >
            {/* {!placeholder && (
              <option value="" disabled hidden>
                Please select
              </option>
            )} */}
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            <GetOptionsJSX
              options={options}
              editMode={editMode}
              name={name}
              dropdownTextColor={dropdownTextColor}
              allowColourInValue={allowColourInValue}
            />
            {optionGroups && Object.keys(optionGroups)?.length > 0
              ? Object.keys(optionGroups)?.map((optionGroupKey, index) => {
                  if (!optionGroups[optionGroupKey]) return null;
                  return (
                    <optgroup label={optionGroupKey} key={index}>
                      <GetOptionsJSX
                        options={optionGroups[optionGroupKey]}
                        editMode={editMode}
                        name={name}
                        dropdownTextColor={dropdownTextColor}
                      />
                    </optgroup>
                  );
                })
              : null}
          </select>
        )}
      </div>
      {hideValidationMessages ? (
        <></>
      ) : rejectRequired ? (
        !(touched[name] ? errors[name] === undefined : true) &&
        !errors[name]?.includes("required") ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {errors[name]}
          </label>
        ) : (
          <></>
        )
      ) : (
        !(touched[name] ? errors[name] === undefined : true) &&
        errors[name] && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {errors[name]}
          </label>
        )
      )}
    </div>
  );
}
export default Dropdown;
