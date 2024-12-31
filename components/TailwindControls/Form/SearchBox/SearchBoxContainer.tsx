import React from "react";
import Link from "next/link";
import { get } from "lodash";
import Button from "../Button/Button";
import { paramCase } from "change-case";
import { Backdrop } from "../../Backdrop";
import { FormikValues, useFormikContext } from "formik";
import CloseIcon from "remixicon-react/CloseLineIcon";
import SearchIcon from "remixicon-react/SearchLineIcon";
import { handleDebounceSearch } from "./debounceHandler";
import PermissionModal from "../../Modals/PermissionModal";
import { AccountModels } from "../../../../models/Accounts";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { AllowedViews } from "../../../../models/allowedViews";
import { ICustomField } from "../../../../models/ICustomField";
import ErrorWarningIcon from "remixicon-react/ErrorWarningFillIcon";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import { appsUrlGenerator } from "../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { sliderWindowType } from "../../../../screens/modules/crm/shared/components/SliderWindow";

export function removeDuplicateObjectFromArray(array: any[], key: string) {
  var check = new Set();
  return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
}
export const SearchBoxContainer = ({
  appName,
  modelName,
  defaultOnSearchIconClick,
  labelLocation,
  isValid,
  rejectRequired,
  label,
  name,
  addClear,
  required,
  formDisabled,
  setFormDisabled,
  disableSearchButton,
  selectedValues,
  editModeValues,
  searchBy = [],
  setSearchProcessing,
  inputRef,
  multiple,
  hiddenInputName,
  setPanelBelowVisible,
  autoFocus,
  placeholder,
  error,
  editMode,
  fieldsList = [],
  setValuesForFields = [],
  additionalFieldName,
  helpText,
  paddingInPixelForInputBox,
  handleUnselectEditModeItem,
  handleUnselectedItem,
  onChange,
  onBlur,
  handleOnChange,
  setSearchModal,
  editModeDataLoading,
  handleClear,
  handleSetValuesForFields = () => {},
  searchDataFound,
  uniqueNameSearchBy,
  editModeFilterValues,
  selectedFilterValues,
  disableGlobalSearchIcon,
  dataTestId,
  hideValidationMessages,
}: {
  appName: string;
  modelName: string;
  defaultOnSearchIconClick?: boolean;
  labelLocation: SupportedLabelLocations;
  isValid: boolean;
  rejectRequired: boolean | undefined;
  label: string | undefined;
  name: string;
  addClear: boolean | undefined;
  required: boolean;
  formDisabled: boolean;
  setFormDisabled: any;
  disableSearchButton: boolean;
  setSearchProcessing: any;
  inputRef: React.RefObject<HTMLInputElement>;
  multiple: boolean;
  selectedValues: any[];
  editModeValues: any[];
  searchBy: string[];
  hiddenInputName: string;
  setPanelBelowVisible: any;
  autoFocus: boolean;
  placeholder: string;
  error: string | undefined;
  editMode: boolean;
  fieldsList: ICustomField[];
  editModeDataLoading: boolean;
  additionalFieldName?: string;
  setValuesForFields?: {
    fetchField: string;
    setValueForField: string;
  }[];
  paddingInPixelForInputBox?: number;
  helpText?: React.ReactElement;
  handleUnselectEditModeItem: (item: any) => void;
  handleUnselectedItem: (item: any) => void;
  onChange: (e: React.ChangeEvent<any>) => void;
  handleOnChange: (value: string) => void;
  onBlur: () => void;
  setSearchModal: (value: sliderWindowType) => void;
  handleClear: () => void;
  handleSetValuesForFields?: (
    items: {
      fetchField: string;
      setValueForField: string;
      value: any;
    }[]
  ) => void;
  searchDataFound: "permission" | "noData" | null;
  uniqueNameSearchBy: string[];
  editModeFilterValues: any[];
  selectedFilterValues: any[];
  disableGlobalSearchIcon: boolean;
  dataTestId?: string;
  hideValidationMessages?: boolean;
}) => {
  const userModel = AccountModels.User;
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  const paddingLeftClass = "pl-2";
  const paddingRightClass = "pr-12";
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

  React.useEffect(() => {
    if (
      selectedValues?.length > 0 &&
      fieldsList?.length > 0 &&
      setValuesForFields?.length > 0
    ) {
      const selectedValue = selectedValues[0];
      let fieldNameValueArray: {
        fetchField: string;
        setValueForField: string;
        value: any;
      }[] = [];
      setValuesForFields?.forEach((field) => {
        const findIndex = fieldsList?.findIndex(
          (fieldInList) => fieldInList.name === field.fetchField
        );
        if (findIndex !== -1) {
          fieldNameValueArray = [
            ...fieldNameValueArray,
            {
              fetchField: field.fetchField,
              setValueForField: field.setValueForField,
              value:
                selectedValue?.values[
                  fieldsList[findIndex].uniqueName.split(".")[2]
                ],
            },
          ];
        }
      });
      handleSetValuesForFields(fieldNameValueArray);
    }
  }, [selectedValues, fieldsList, setValuesForFields]);

  const allRecords = [...editModeFilterValues, ...selectedFilterValues];

  if (searchDataFound === "permission") {
    searchDataFound = "permission";
  } else if (editMode) {
    if (
      values?.[name] &&
      Array.isArray(values?.[name]) &&
      (editModeValues?.length === values?.[name]?.length ||
        allRecords?.length === values?.[name]?.length)
    ) {
      searchDataFound = null;
    } else if (
      values?.[name] &&
      typeof values?.[name] === "string" &&
      (editModeValues?.length === 1 || allRecords?.length === 1)
    ) {
      searchDataFound = null;
    } else if (values?.[name]) {
      searchDataFound = "noData";
    }
  } else if (
    values?.[name] &&
    Array.isArray(values?.[name]) &&
    allRecords?.length !== values?.[name]?.length
  ) {
    searchDataFound = "noData";
  } else {
    searchDataFound = null;
  }

  const renderFieldData = (
    searchResult: Record<string, string>,
    searchBy: string[]
  ) => {
    // const updatedSearchBy = getNamesOnlyFromField(searchBy);
    if (modelName === userModel && searchResult) {
      if (
        !searchResult["firstName"] &&
        !searchResult["middleName"] &&
        !searchResult["lastName"]
      ) {
        return "-";
      }
      return `${searchResult["firstName"] || ""} ${
        searchResult["middleName"] || ""
      } ${searchResult["lastName"] || ""}`;
    } else if (searchResult) {
      let result = "";
      for (let index = 0; index < searchBy.length; index++) {
        result = searchResult[searchBy[index]]
          ? result + searchResult[searchBy[index]] + " "
          : result;
      }
      return result.trim() ? result : searchResult["name"] || "-";
    } else return "-";
  };

  return (
    <>
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses} ${
              searchDataFound ? "flex items-center" : ""
            }`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
            {searchDataFound ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPermissionModal(true);
                }}
              >
                <ErrorWarningIcon
                  size={14}
                  className="text-vryno-warning-secondary ml-1"
                />
              </button>
            ) : (
              <></>
            )}
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              data-testid={paramCase(`clear-${name}`)}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, "");
                  setFieldValue(hiddenInputName, "");
                  setFormDisabled(false);
                  return;
                }
                handleClear();
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
      <div
        className={`relative focus:shadow-md text-sm bg-white rounded-md border ${textBoxClasses} ${borderClass} ${focusBorderClass}`}
      >
        <div
          className={`py-[2.5px] max-h-44 overflow-y-scroll ${
            (selectedValues.length || editModeValues.length) && values[name]
              ? `${multiple ? "mx-2 my-1" : "mx-2"}`
              : "hidden"
          }`}
        >
          {editModeFilterValues.map((value, index) => (
            <span
              className={`bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl mr-2 inline-flex justify-center items-center my-1 text-xs`}
              key={index}
            >
              <>
                {modelName === AccountModels.User ? (
                  ["firstName", "lastName"].map((item, innerIndex) => (
                    <span className="pl-1" key={innerIndex}>{`${
                      value[item] ? value[item] : ""
                    }`}</span>
                  ))
                ) : (
                  <Link
                    legacyBehavior
                    href={appsUrlGenerator(
                      appName,
                      modelName,
                      AllowedViews.detail,
                      get(value, "id", get(value, "rowId", ""))
                    )}
                  >
                    <a target="_blank" className="pl-1 underline">
                      {renderFieldData(value, searchBy)}
                    </a>
                  </Link>
                )}
              </>
              <Button
                id={`remove-selected-search-value-${
                  modelName === AccountModels.User
                    ? ["firstName", "lastName"].map((item, innerIndex) =>
                        value[item] ? value[item] : ""
                      )
                    : renderFieldData(value, searchBy)
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselectEditModeItem(value);
                }}
                disabled={formDisabled}
                customStyle=""
                userEventName="remove-selected-search-value:action-click"
              >
                <CloseIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
              </Button>
            </span>
          ))}
          {selectedFilterValues.map((value, index) => (
            <span
              key={index}
              className="bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl mr-2 inline-flex justify-center items-center my-1 text-xs"
            >
              <>
                {modelName === AccountModels.User ? (
                  ["first_name", "last_name"].map((item, innerIndex) => (
                    <span className="pl-1" key={innerIndex}>{`${
                      value?.values[item] ? value?.values[item] : ""
                    }`}</span>
                  ))
                ) : value?.addedByQuickCreate ? (
                  // getFieldNameForSearch(fieldsList, searchBy).map(
                  //     (item, innerIndex) => (
                  <Link
                    legacyBehavior
                    href={appsUrlGenerator(
                      appName,
                      modelName,
                      AllowedViews.detail,
                      get(value, "id", get(value, "rowId", ""))
                    )}
                  >
                    <a target="_blank" className="pl-1 underline">
                      {/* {`${value[item] ? value[item] : ""}`} */}
                      {renderFieldData(value?.values, uniqueNameSearchBy)}
                      {/* {getSearchedValue(value, item)} */}
                    </a>
                  </Link>
                ) : (
                  <Link
                    legacyBehavior
                    href={appsUrlGenerator(
                      appName,
                      modelName,
                      AllowedViews.detail,
                      get(value, "id", get(value, "rowId", ""))
                    )}
                  >
                    <a target="_blank" className="pl-1 underline ">
                      {renderFieldData(value?.values, uniqueNameSearchBy)}
                    </a>
                  </Link>
                )}
              </>
              <Button
                id={`remove-selected-search-value-${
                  modelName === AccountModels.User
                    ? ["first_name", "last_name"].map((item, innerIndex) =>
                        value[item] ? value[item] : ""
                      )
                    : renderFieldData(value?.values, uniqueNameSearchBy)
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselectedItem(value);
                }}
                disabled={formDisabled}
                customStyle=""
                userEventName="remove-selected-search-value:action-click"
              >
                <CloseIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
              </Button>
            </span>
          ))}
        </div>
        <div className={`flex w-full`}>
          <input
            ref={inputRef}
            id={paramCase(name)}
            data-testid={
              dataTestId
                ? values?.[name]?.length
                  ? `${paramCase(dataTestId)}-${values[name]?.toString()}`
                  : paramCase(dataTestId)
                : paramCase(name)
            }
            name={hiddenInputName}
            onChange={(e) => {
              onChange(e);
              setSearchProcessing(true);
              handleDebounceSearch({
                fieldName: paramCase(name),
                handleOnDebounce: (value) => handleOnChange(value),
                setProcessingData: (value) => {},
                ref: inputRef,
              });
            }}
            onBlur={onBlur}
            value={values[hiddenInputName]}
            onFocus={() => {
              setPanelBelowVisible(true);
            }}
            autoFocus={autoFocus}
            placeholder={placeholder}
            disabled={formDisabled}
            autoComplete="new-password"
            className={`relative w-full placeholder-vryno-placeholder focus:outline-none rounded-md text-gray-700
                    ${paddingRightClass}
                    ${paddingLeftClass}
                    ${
                      !multiple && "focus:border-blue-200 border border-gray-50"
                    }
                    ${
                      !multiple &&
                      (selectedValues.length || editModeValues.length) &&
                      values[name]
                        ? "hidden"
                        : ""
                    }
                    ${
                      multiple &&
                      (selectedValues.length || editModeValues.length)
                        ? `${
                            paddingInPixelForInputBox
                              ? `pb-[${paddingInPixelForInputBox}px]`
                              : "pb-2"
                          }`
                        : `${
                            paddingInPixelForInputBox
                              ? `py-[${paddingInPixelForInputBox}px]`
                              : "pb-2 pt-1.5"
                          }`
                    }`}
          />
          {(!multiple &&
            removeDuplicateObjectFromArray(editModeValues, "id")
              ?.filter((emValue) => {
                if (
                  selectedValues.filter((sValue) => sValue.rowId === emValue.id)
                    ?.length === 0
                )
                  return emValue;
              })
              ?.filter((emValue) => {
                if (multiple) {
                  const findIndex = values[name]?.length
                    ? (values[name] as any)?.findIndex(
                        (value: string) =>
                          value === (emValue?.id || emValue?.rowId)
                      )
                    : -1;
                  if (findIndex !== -1) return emValue;
                } else {
                  if ((emValue?.id || emValue?.rowId) === values[name])
                    return emValue;
                }
              }).length > 0) ||
          selectedValues.length > 0
            ? null
            : !multiple &&
              //here
              IconInsideInputBox(
                <SearchIcon
                  size={20}
                  className="text-vryno-icon-gray"
                  data-testid={paramCase(`search-icon-${name}`)}
                />,
                IconLocation.Right,
                defaultOnSearchIconClick
                  ? () => setPanelBelowVisible(true)
                  : () => setSearchModal(""),
                disableGlobalSearchIcon || formDisabled
              )}
          {multiple &&
            IconInsideInputBox(
              <SearchIcon
                size={20}
                className="text-vryno-icon-gray"
                data-testid={paramCase(`search-icon-${name}`)}
              />,
              IconLocation.Right,
              defaultOnSearchIconClick
                ? () => setPanelBelowVisible(true)
                : () => setSearchModal(""),
              disableGlobalSearchIcon || formDisabled,
              multiple && values[name]?.length >= 1 && values[name]?.length <= 3
                ? "30"
                : multiple && values[name]?.length >= 4
                ? "40"
                : undefined
            )}
        </div>
      </div>
      {helpText}
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
      ) : !isValid && error ? (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {error}
        </label>
      ) : !editModeDataLoading &&
        editMode &&
        required &&
        (!values[name] ||
          (Array.isArray(values[name]) && values[name]?.length === 0)) &&
        selectedValues?.length === 0 &&
        editModeValues?.length === 0 ? (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {`${label} is required`}
        </label>
      ) : (
        !editModeDataLoading &&
        editMode &&
        required &&
        values[name] &&
        selectedValues?.length === 0 &&
        editModeValues?.length === 0 && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {`${label} deleted`}
          </label>
        )
      )}
      {showPermissionModal && (
        <>
          <PermissionModal
            formHeading={
              searchDataFound == "permission"
                ? "No Permission"
                : searchDataFound === "noData"
                ? "No Data Found"
                : "Error"
            }
            onCancel={() => setShowPermissionModal(false)}
            type={searchDataFound}
            recordIds={
              values?.[name] &&
              Array.isArray(values?.[name]) &&
              allRecords?.length !== values?.[name]?.length
                ? values[name]
                    .filter(
                      (id: string) =>
                        !allRecords.map((val) => val.id).includes(id)
                    )
                    .toString()
                : values[name]
            }
            shortMessage={false}
          />
          <Backdrop onClick={() => setShowPermissionModal(false)} />
        </>
      )}
    </>
  );
};
