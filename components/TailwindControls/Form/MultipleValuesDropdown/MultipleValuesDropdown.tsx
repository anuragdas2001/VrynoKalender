import React, { ForwardedRef, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import CloseIcon from "remixicon-react/CloseLineIcon";
import RequiredIndicator from "../Shared/RequiredIndicator";
import Button from "../Button/Button";

export type MultipleValuesDropdownProps = {
  name: string;
  placeholder?: string;
  label?: string;
  editMode?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  labelLocation?: SupportedLabelLocations;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  usedInForm?: boolean;
  options?: Array<any>;
  limitSelectionTo?: number;
  allowMargin?: boolean;
  rejectRequired?: boolean;
  addClear?: boolean;
  formResetted?: boolean;
  paddingInPixelForInputBox?: number;
  allowColourInValue?: boolean;
  showLabel?: boolean;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  rightIconClick?: () => void;
  dataTestId?: string;
  hideValidationMessages?: boolean;
};

function MultipleValuesDropdown(
  {
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
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
    options = [],
    limitSelectionTo,
    allowMargin = true,
    rejectRequired,
    addClear,
    formResetted,
    paddingInPixelForInputBox,
    allowColourInValue,
    showLabel = true,
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    dataTestId,
    hideValidationMessages,
  }: MultipleValuesDropdownProps,
  ref: ForwardedRef<HTMLInputElement> | null
) {
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
  const { errors, touched, values, setFieldValue } =
    useFormikContext<Record<string, string | string[]>>();
  const [editModeValues, setEditModeValues] = useState<Array<any>>([]);
  const [formDisabled, setFormDisabled] = React.useState(disabled);

  const getEditModeValue = (
    selectedValue: {
      value: string;
      label: string;
    },
    editModeValues: any[]
  ) => {
    return multiple
      ? limitSelectionTo
        ? [
            ...editModeValues,
            {
              value: selectedValue?.value || "",
              label: selectedValue?.label || "",
            },
          ].length > limitSelectionTo
          ? [...editModeValues]
          : [
              ...editModeValues,
              {
                value: selectedValue?.value || "",
                label: selectedValue?.label || "",
              },
            ]
        : [
            ...editModeValues,
            {
              value: selectedValue?.value || "",
              label: selectedValue?.label || "",
            },
          ]
      : [
          {
            value: selectedValue?.value || "",
            label: selectedValue?.label || "",
          },
        ];
  };

  const handleSelection = (e: React.ChangeEvent<any>) => {
    const { value } = e.currentTarget;
    const resultValues = multiple
      ? limitSelectionTo
        ? [...editModeValues.map((value) => value.value), value].length >
          limitSelectionTo
          ? [...editModeValues.map((value) => value.value)]
          : [...editModeValues.map((value) => value.value), value]
        : [...editModeValues.map((value) => value.value), value]
      : [value];
    const selectedValue = options.filter((option) => option.value == value)[0];
    setEditModeValues(getEditModeValue(selectedValue, editModeValues));
    setFieldValue("dropdown", undefined);
    setFieldValue(name, resultValues);
  };

  const handleUnselectedItem = (item: any) => {
    let remainingValues = editModeValues.filter(
      (value) => JSON.stringify(value) !== JSON.stringify(item)
    );
    setEditModeValues(remainingValues);
    setFieldValue(
      name,
      multiple ? [...remainingValues.map((value) => value.value)] : null
    );
  };

  useEffect(() => {
    let editModeVal = [];
    if (values[name] && options && options.length > 0 && editMode) {
      for (let i = 0; i < values[name].length; i++) {
        editModeVal.push(
          options.filter((option) => {
            return option.value == values[name][i];
          })[0]
        );
      }
      editModeVal = editModeVal.filter((val) => val !== undefined);
      setEditModeValues(editModeVal);
    }
  }, [options, editMode]);

  const resetFormValues = () => {
    setEditModeValues([]);
    setFieldValue("dropdown", undefined);
    setFieldValue(name, []);
  };

  React.useEffect(() => {
    if (formResetted) {
      resetFormValues();
    }
  }, [formResetted]);

  React.useEffect(() => {
    if (!values[name] && !formDisabled) {
      resetFormValues();
    }
    if (values[name]?.length && editModeValues?.length === 0) {
      let updatedEditModeValues = [...editModeValues];
      for (let i = 0; i < values[name].length; i++) {
        const selectedValue = options.filter(
          (option) => option.value == values[name][i]
        )[0];
        updatedEditModeValues = getEditModeValue(
          selectedValue,
          updatedEditModeValues
        );
      }
      setEditModeValues(updatedEditModeValues);
    }
  }, [values[name]]);

  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);

  return (
    <>
      <div className={`flex ${divFlexCol} ${allowMargin && "my-2"} `}>
        <div className="w-full flex justify-between">
          {label && showLabel && (
            <label
              htmlFor={paramCase(name)}
              className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray  ${labelClasses} `}
            >
              {label}
              <RequiredIndicator required={rejectRequired ? false : required} />
            </label>
          )}
          {addClear && !required && (
            <div className="flex self-start">
              <input
                id={`clear-${name}`}
                type="checkbox"
                onClick={() => {
                  if (formDisabled) {
                    setFieldValue("dropdown", undefined);
                    setFieldValue(name, null);
                    setFormDisabled(false);
                    return;
                  }
                  setFieldValue(name, null);
                  setFieldValue("dropdown", undefined);
                  setFormDisabled(true);
                }}
                className="cursor-pointer mr-1.5"
              />
              <label
                htmlFor={`clear-${name}`}
                className="cursor-pointer text-xs"
              >
                clear
              </label>
            </div>
          )}
        </div>
        <div
          className={`relative focus:shadow-md border rounded-md text-sm break-words bg-white ${textBoxClasses} ${borderClass} ${focusBorderClass}`}
        >
          <div
            className={`py-[2.5px] max-h-44 overflow-y-scroll ${
              editModeValues.length
                ? `${multiple ? "mx-2 my-1" : "mx-2"}`
                : "hidden"
            }`}
          >
            {editModeValues?.length > 0 &&
              editModeValues?.map((value, index) => (
                <span
                  className={`bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl mr-2 inline-flex justify-center items-center my-1 text-xs`}
                  key={index}
                >
                  {options?.filter((option) => option.value === value.value)
                    ?.length > 0 &&
                    options?.filter((option) => option.value === value.value)[0]
                      ?.colourHex &&
                    allowColourInValue && (
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: `${
                            options?.filter(
                              (option) => option.value === value.value
                            )[0]?.colourHex
                          }`,
                        }}
                        data-testid={`${label}-${value?.label}-color`}
                      />
                    )}
                  <span
                    className="pl-1"
                    data-testid={String(value?.label)}
                  >{`${value?.label}`}</span>
                  <Button
                    id={`multiple-values-dropdown-close-${String(
                      value?.label
                    )}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleUnselectedItem(value);
                    }}
                    customStyle=""
                    userEventName="multiple-values-dropdown-close:action-click"
                  >
                    <CloseIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
                  </Button>
                </span>
              ))}
          </div>
          <select
            id={paramCase(name)}
            data-testid={dataTestId ? paramCase(dataTestId) : paramCase(name)}
            name="dropdown"
            onChange={(selectedOption: React.ChangeEvent<any>) => {
              if (
                values[name] &&
                values[name]?.includes(selectedOption.target.value)
              ) {
              } else {
                handleSelection(selectedOption);
              }
            }}
            onBlur={onBlur}
            value={""}
            // @ts-ignore
            placeholder={values[name]?.toString() || placeholder}
            disabled={
              formDisabled ||
              (options.length > 0 &&
                options.filter((option) => {
                  if (typeof option?.visible === "boolean") {
                    if (option.visible) return option;
                  } else return option;
                }).length === 0)
            }
            className={`relative w-full rounded-md text-sm placeholder-vryno-placeholder focus:outline-none ${
              paddingInPixelForInputBox
                ? `py-[${paddingInPixelForInputBox}px]`
                : `py-2`
            } px-2 bg-white`}
          >
            {!placeholder && (
              <option value="" selected disabled hidden>
                Please select a value
              </option>
            )}
            {placeholder && (
              <option value="" selected disabled hidden>
                {placeholder}
              </option>
            )}
            {options.length > 0 &&
              options
                ?.filter((opt, index) => {
                  if (
                    !editMode &&
                    typeof opt?.visible === "boolean" &&
                    !opt.visible
                  )
                    return null;
                  else if (
                    editMode &&
                    typeof opt?.visible === "boolean" &&
                    !opt.visible &&
                    values[name] === opt.value
                  )
                    return opt;
                  else if (
                    editMode &&
                    typeof opt?.visible === "boolean" &&
                    !opt.visible &&
                    values[name] !== opt.value
                  )
                    return null;
                  else return opt;
                })
                ?.filter(
                  (opt) =>
                    !editModeValues
                      ?.map((item) => item.value)
                      .includes(opt?.value)
                )
                ?.filter((opt) => opt)
                .map((opt, index) => (
                  <option
                    className={`w-full text-xsm`}
                    id={opt?.label}
                    data-testid={paramCase(opt?.label ?? "")}
                    key={index}
                    value={opt?.value ? opt?.value : undefined}
                    label={`${
                      allowColourInValue && opt?.colourHex ? "\u2B24   " : ""
                    }${opt?.label}`}
                    disabled={
                      (typeof opt?.visible === "boolean" && !opt.visible) ||
                      editModeValues
                        ?.map((item) => item.value)
                        .includes(opt?.value)
                    }
                    style={
                      allowColourInValue && opt?.colourHex
                        ? { color: opt?.colourHex }
                        : { color: "black" }
                    }
                  >
                    {allowColourInValue && opt?.colourHex ? "\u2B24   " : ""}
                    {`${opt?.label}`}
                  </option>
                ))}
          </select>
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
    </>
  );
}
export default React.forwardRef(MultipleValuesDropdown);
