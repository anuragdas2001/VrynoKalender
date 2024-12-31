import React, { ForwardedRef, useEffect, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { MultipleKeyValueInputBoxProps } from "./MultipleKeyValueInputBoxProps";
import { MultipleKeyValueInputBoxPresentational } from "./MultipleKeyValueInputBoxPresentational";
import _ from "lodash";
import { Option } from "../MultipleValuesLookupBox/MultipleValuesLookupBoxProps";

function MultipleKeyValueInputBox(
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
    dataType,
    dataTypeChanged = false,
    onDataTypeChange = () => {},
    externalOptions = [],
    ...props
  }: MultipleKeyValueInputBoxProps,
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

  const borderClass = isValid
    ? "border-vryno-form-border-gray"
    : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";
  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>();
  const [editModeValues, setEditModeValues] = useState<Option[]>([]);

  const setUpdatedOptions = (options: Option[]) => {
    let updatedOptions: Record<string, string> = {};
    let visibleOptions = options?.filter((option) => option.visible);
    visibleOptions?.forEach(
      (option) => (updatedOptions[option.value] = _.get(option.label, "en", ""))
    );
    return updatedOptions;
  };

  const handleNewOptionAdd = (label: string, value: string) => {
    let updatedOptions = editModeValues.concat({
      id: editModeValues.length,
      label: { en: label },
      value,
      visible: true,
      newRecord: true,
      defaultOption: false,
    });
    setFieldValue(`addOptionsToLookupLabel${editModeValues.length}`, label);
    setFieldValue(`addOptionsToLookupValue${editModeValues.length}`, value);
    setFieldValue(`addOptionsToLookupVisible${editModeValues.length}`, true);
    setEditModeValues(updatedOptions);
    setFieldValue(name, setUpdatedOptions(updatedOptions));
  };

  const handleVisibilityUpdate = (item: Option) => {
    let updatedOptionsArray = editModeValues;
    const updatedOptionIndex = updatedOptionsArray.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: item.label,
      value: item.value,
      visible: !item.visible,
      newRecord: item.newRecord,
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray));
    setEditModeValues(updatedOptionsArray);
  };

  const handleLabelChange = (item: Option, updatedLabel: string) => {
    let updatedOptionsArray = editModeValues;
    const updatedOptionIndex = editModeValues.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: { en: updatedLabel },
      value: item.value,
      visible: item.visible,
      newRecord: item.newRecord,
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray));
    setEditModeValues(updatedOptionsArray);
  };

  const handleValueChange = (item: Option, updatedValue: string) => {
    let updatedOptionsArray = editModeValues;
    const updatedOptionIndex = editModeValues.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: item.label,
      value: updatedValue,
      visible: item.visible,
      newRecord: item.newRecord,
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray));
    setEditModeValues(updatedOptionsArray);
  };

  useEffect(() => {
    let itemCount = 0;
    let editValues: Option[] = [];
    if (values[name] && editMode) {
      for (const key of Object.keys(values[name])) {
        setFieldValue(`addOptionsToLookupLabel${itemCount}`, values[name][key]);
        setFieldValue(`addOptionsToLookupValue${itemCount}`, key);
        setFieldValue(`addOptionsToLookupVisible${itemCount}`, true);
        editValues.push({
          id: itemCount++,
          label: { en: values[name][key] },
          value: key,
          visible: true,
          newRecord: false,
          defaultOption: false,
        });
      }
    }
    setFieldValue(name, setUpdatedOptions([...editValues]));
    setEditModeValues([...editValues]);
  }, [editMode]);

  const uiProps = {
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
  };

  return <MultipleKeyValueInputBoxPresentational {...uiProps} />;
}

export default React.forwardRef(MultipleKeyValueInputBox);
