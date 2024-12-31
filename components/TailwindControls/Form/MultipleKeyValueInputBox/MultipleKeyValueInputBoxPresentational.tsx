import React from "react";
import { paramCase } from "change-case";
import FormInputBox from "../InputBox/FormInputBox";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import SubtractIcon from "remixicon-react/IndeterminateCircleFillIcon";
import Button from "../Button/Button";
import { Option } from "../MultipleValuesLookupBox/MultipleValuesLookupBoxProps";

type MultipleKeyValueInputBoxPresentationalProps = {
  divFlexCol: string;
  usedInForm: undefined | boolean;
  label: string | undefined;
  name: string;
  labelClasses: string;
  textBoxClasses: string;
  borderClass: string;
  focusBorderClass: string;
  values: any;
  handleNewOptionAdd: (label: string, value: string) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  editModeValues: Option[];
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleLabelChange: (item: Option, updatedLabel: string) => void;
  handleValueChange: (item: Option, updatedValue: string) => void;
  handleVisibilityUpdate: (item: Option, updatedVisibility?: boolean) => void;
  isValid: undefined | boolean;
  error: string | undefined;
};
export function MultipleKeyValueInputBoxPresentational<T>({
  divFlexCol,
  usedInForm,
  label,
  name,
  labelClasses,
  textBoxClasses,
  borderClass,
  focusBorderClass,
  values,
  handleNewOptionAdd,
  setFieldValue,
  editModeValues,
  handleChange,
  handleLabelChange,
  handleValueChange,
  handleVisibilityUpdate,
  isValid,
  error,
}: MultipleKeyValueInputBoxPresentationalProps) {
  return (
    <>
      <div className={`flex ${divFlexCol} ${usedInForm ? "my-4" : ""}`}>
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray  ${labelClasses} `}
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
          rounded-md text-sm break-words py-2 px-2 bg-vryno-header-color max-h-64 overflow-y-scroll`}
        >
          <div className="grid grid-cols-7">
            <div className="col-span-6 sm:grid sm:grid-cols-2 sm:gap-x-4">
              <FormInputBox
                name="addOptionsToLookupValue"
                allowMargin={false}
                placeholder={`Enter Key to add`}
              />
              <FormInputBox
                name="addOptionsToLookupLabel"
                allowMargin={false}
                placeholder={`Enter Value to add`}
              />
            </div>
            <Button
              id="multi-key-value-add"
              customStyle={`flex items-center justify-center`}
              onClick={
                values["addOptionsToLookupLabel"] &&
                values["addOptionsToLookupValue"]
                  ? () => {
                      handleNewOptionAdd(
                        values["addOptionsToLookupLabel"],
                        values["addOptionsToLookupValue"]
                      );
                      setFieldValue("addOptionsToLookupLabel", "");
                      setFieldValue("addOptionsToLookupValue", "");
                    }
                  : () => {}
              }
              userEventName="multi-key-value-add-click"
            >
              <AddCircleFillIcon
                className={`${
                  values["addOptionsToLookupLabel"] &&
                  values["addOptionsToLookupValue"]
                    ? "text-vryno-theme-light-blue  cursor-pointer"
                    : "text-vryno-theme-blue-disable"
                }`}
              />
            </Button>
          </div>
          {editModeValues
            ?.filter((editModeValue) => editModeValue.visible)
            ?.slice()
            ?.sort((item1, item2) =>
              (item1.id || NaN) < (item2.id || NaN) ? 1 : -1
            )
            .map((editModeValue, index) => (
              <div className="grid grid-cols-7 w-full mt-2" key={index}>
                <div className="col-span-6 sm:grid sm:grid-cols-2 sm:gap-x-4 my-1">
                  <FormInputBox
                    allowMargin={false}
                    name={`addOptionsToLookupValue${editModeValue.id}`}
                    onChange={(e) => {
                      handleChange(e);
                      handleValueChange(editModeValue, e.currentTarget.value);
                    }}
                    disabled={!editModeValue.visible}
                  />
                  <FormInputBox
                    allowMargin={false}
                    name={`addOptionsToLookupLabel${editModeValue.id}`}
                    onChange={(e) => {
                      handleChange(e);
                      handleLabelChange(editModeValue, e.currentTarget.value);
                    }}
                    disabled={!editModeValue.visible}
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {editModeValue.visible ? (
                    <Button
                      id="multi-key-value-edit-hide"
                      onClick={() => {
                        handleVisibilityUpdate(editModeValue);
                      }}
                      customStyle=""
                      userEventName="multi-key-value-edit-hide-click"
                    >
                      <SubtractIcon
                        className="text-red-400 cursor-pointer"
                        name={`addOptionsToLookupVisible${editModeValue.id}`}
                      />
                    </Button>
                  ) : (
                    <Button
                      id="multi-key-value-edit-show"
                      onClick={() => {
                        handleVisibilityUpdate(editModeValue);
                      }}
                      customStyle=""
                      userEventName="multi-key-value-edit-show-click"
                    >
                      <AddCircleFillIcon
                        className="text-vryno-theme-light-blue cursor-pointer"
                        name={`addOptionsToLookupVisible${editModeValue.id}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
        {!isValid && error && (
          <label className="text-red-600 ml-2 mt-1 text-xs">{error}</label>
        )}
      </div>
    </>
  );
}
