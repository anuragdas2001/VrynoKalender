import React from "react";
import { paramCase } from "change-case";
import FormInputBox from "../InputBox/FormInputBox";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import SubtractIcon from "remixicon-react/IndeterminateCircleFillIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import Button from "../Button/Button";
import { Option } from "./MultipleValuesLookupBoxProps";

type MultipleValuesLookupBoxPresentationalProps = {
  divFlexCol: string;
  usedInForm: undefined | boolean;
  label: string | undefined;
  name: string;
  labelClasses: string;
  textBoxClasses: string;
  borderClass: string;
  focusBorderClass: string;
  values: any;
  editModeValues: Option[];
  isValid: undefined | boolean;
  error: string | undefined;
  pickupListError?: { error: boolean; fieldName: string }[];
  allowLookupColourHex?: boolean;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleLabelChange: (item: Option, updatedLabel: string) => void;
  handleColourHexChange: (item: Option, updatedColourHex: string) => void;
  handleNewOptionAdd: (label: string, value: string, colourHex: string) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleVisibilityUpdate: (item: Option, updatedVisibility?: boolean) => void;
  setPickupListError?: (value: { error: boolean; fieldName: string }) => void;
  handleUpArrow: (item: Option) => void;
  handleDownArrow: (item: Option) => void;
};
export function MultiValuesLookupBoxPresentational<T>({
  divFlexCol,
  usedInForm,
  label,
  name,
  labelClasses,
  textBoxClasses,
  borderClass,
  focusBorderClass,
  values,
  editModeValues,
  isValid,
  error,
  pickupListError,
  allowLookupColourHex = false,
  handleNewOptionAdd,
  handleColourHexChange,
  setFieldValue,
  handleChange,
  handleLabelChange,
  handleVisibilityUpdate,
  setPickupListError = () => {},
  handleUpArrow = () => {},
  handleDownArrow = () => {},
}: MultipleValuesLookupBoxPresentationalProps) {
  React.useEffect(() => {
    setFieldValue("addOptionsToLookupColourHex", "#000000");
  }, []);

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
          rounded-md text-sm break-words py-3.5 pl-5 pr-2 bg-vryno-header-colourHex`}
        >
          <div className="grid grid-cols-10 gap-x-2 pr-2">
            <div className="col-span-8">
              <FormInputBox
                name="addOptionsToLookupLabel"
                allowMargin={false}
                placeholder={`Enter option to add`}
              />
            </div>
            <div>
              <FormInputBox
                name="addOptionsToLookupColourHex"
                type="color"
                allowMargin={false}
                disabled={!allowLookupColourHex}
              />
            </div>
            <div className="h-[39.5px] flex items-center justify-center">
              <Button
                id="multiValuesLookup-add-options"
                customStyle=""
                userEventName="multiValuesLookup-add-options-click"
                onClick={
                  values["addOptionsToLookupLabel"]?.trim()
                    ? () => {
                        handleNewOptionAdd(
                          values["addOptionsToLookupLabel"],
                          values["addOptionsToLookupLabel"],
                          values["addOptionsToLookupColourHex"] ?? "#000000"
                        );
                        setFieldValue("addOptionsToLookupLabel", "");
                        setFieldValue("addOptionsToLookupColourHex", "#000000");
                      }
                    : () => {}
                }
              >
                <AddCircleFillIcon
                  id={`add-options-to-lookup`}
                  className={`${
                    values["addOptionsToLookupLabel"]?.trim()
                      ? "text-vryno-theme-light-blue  cursor-pointer"
                      : "text-vryno-theme-blue-disable"
                  }`}
                />
              </Button>
            </div>
          </div>
          <div className="max-h-56 overflow-y-scroll">
            {editModeValues
              .slice()
              ?.sort((item1, item2) =>
                (item1?.order ?? NaN) < (item2?.order ?? NaN) ? -1 : 1
              )
              .map((editModeValue, index) => {
                const dataTestIdName =
                  editModeValue?.label?.en || editModeValue?.value;
                return (
                  <div
                    className="grid grid-cols-10 gap-x-2 w-full mt-2"
                    key={index}
                  >
                    <div
                      className={`items-center ${
                        editModeValues?.length <= 1
                          ? "hidden"
                          : "flex gap-x-2 col-span-2"
                      }`}
                    >
                      <Button
                        id={`multiValuesLookup-${dataTestIdName}-up-arrow`}
                        onClick={() => handleUpArrow(editModeValue)}
                        customStyle={`cursor-pointer w-7 h-7 rounded-md justify-center items-center bg-vryno-theme-light-blue ${
                          index === 0 ? "hidden" : "flex"
                        }`}
                        userEventName={`multiValuesLookup-${dataTestIdName}-up-arrow:action-click`}
                      >
                        <ArrowUpIcon size={18} className="text-white" />
                      </Button>
                      <Button
                        id={`multiValuesLookup-${dataTestIdName}-down-arrow`}
                        onClick={() => handleDownArrow(editModeValue)}
                        customStyle={`cursor-pointer w-7 h-7 rounded-md justify-center items-center bg-vryno-theme-light-blue ${
                          index === editModeValues?.length - 1
                            ? "hidden"
                            : "flex"
                        }`}
                        userEventName={`multiValuesLookup-${dataTestIdName}-down-arrow:action-click`}
                      >
                        <ArrowDownIcon size={18} className="text-white" />
                      </Button>
                    </div>
                    <div
                      className={`${
                        editModeValues?.length <= 1
                          ? `col-span-7`
                          : `col-span-6`
                      } my-1`}
                    >
                      <FormInputBox
                        nameId={`addOptionsToLookupLabel${index}`}
                        allowMargin={false}
                        name={`addOptionsToLookupLabel${editModeValue.id}`}
                        onChange={(e) => {
                          handleChange(e);
                          handleLabelChange(
                            editModeValue,
                            e.currentTarget.value
                          );
                          e.currentTarget.value.length === 0 ||
                          e.currentTarget.value.trim().length === 0
                            ? setPickupListError({
                                error: true,
                                fieldName: `addOptionsToLookupLabel${editModeValue.id}`,
                              })
                            : setPickupListError({
                                error: false,
                                fieldName: `addOptionsToLookupLabel${editModeValue.id}`,
                              });
                        }}
                        externalError={
                          pickupListError?.filter(
                            (field) =>
                              field.fieldName ===
                              `addOptionsToLookupLabel${editModeValue.id}`
                          )?.length !== 0 &&
                          pickupListError?.filter(
                            (field) =>
                              field.fieldName ===
                              `addOptionsToLookupLabel${editModeValue.id}`
                          )[0].error === true
                            ? "Please enter a valid value"
                            : ""
                        }
                        disabled={!editModeValue.visible}
                      />
                    </div>
                    <div className="my-1">
                      <FormInputBox
                        nameId={`addOptionsTo${editModeValue?.label?.en}LookupColourHex`}
                        dataTestId={`addOptionsTo${
                          editModeValue?.label?.en[0]?.toLowerCase() ===
                          editModeValue?.label?.en[0]
                            ? `-${editModeValue?.label?.en}`
                            : editModeValue?.label?.en
                        }LookupColourHex`}
                        allowMargin={false}
                        name={`addOptionsToLookupColourHex${editModeValue.id}`}
                        onChange={(e) => {
                          handleChange(e);
                          handleColourHexChange(
                            editModeValue,
                            e.currentTarget.value ?? "#000000"
                          );
                        }}
                        type="color"
                        disabled={
                          !editModeValue.visible || !allowLookupColourHex
                        }
                      />
                    </div>
                    <div className="h-[40.5px] flex items-center justify-center">
                      <Button
                        id="multiValuesLookup-edit-options"
                        customStyle="col-span-1 flex items-center justify-center"
                        userEventName="multiValuesLookup-add-remove-options:action-click"
                        onClick={() => {
                          handleVisibilityUpdate(editModeValue);
                        }}
                      >
                        {editModeValue.visible ? (
                          <SubtractIcon
                            id={`remove-options-to-lookup-visible-${dataTestIdName}`}
                            className="text-red-400 cursor-pointer"
                            name={`addOptionsToLookupVisible${dataTestIdName}`}
                          />
                        ) : (
                          <AddCircleFillIcon
                            id={`add-options-to-lookup-visible-${dataTestIdName}`}
                            className="text-vryno-theme-light-blue cursor-pointer"
                            name={`addOptionsToLookupVisible${dataTestIdName}`}
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {!isValid && error && (
          <label className="text-red-600 ml-2 mt-1 text-xs">{error}</label>
        )}
      </div>
    </>
  );
}
