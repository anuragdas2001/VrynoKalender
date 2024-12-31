import React, { ForwardedRef, useEffect, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import {
  MultipleValuesLookupBoxProps,
  Option,
} from "./MultipleValuesLookupBoxProps";
import { MultiValuesLookupBoxPresentational } from "./MultiValuesLookupBoxPresentational";
import _ from "lodash";

export const setUpdatedOptions = (options: Option[], dataType?: string) => {
  let lookupOptionsStringLookup: any[] = [];
  let lookupOptions: Record<string, string> = {};
  let visibleOptions = [...options];
  if (dataType === "stringLookup") {
    visibleOptions.map(
      (option) =>
        (lookupOptionsStringLookup = [
          ...lookupOptionsStringLookup,
          { key: option.value, label: { en: option.label?.en } },
        ])
    );
  } else if (dataType === "lookup" || dataType === "multiSelectLookup") {
    visibleOptions.forEach(
      (option) =>
        (lookupOptionsStringLookup = [
          ...lookupOptionsStringLookup,
          {
            id: option?.newRecord ? null : option?.value ?? option?.id,
            label: { en: option?.label?.en },
            recordStatus: option?.visible ? "a" : "i",
            order: option?.order ?? option?.id,
            colourHex: option?.colourHex ?? "#000000",
            visible: option?.visible ?? false,
            defaultOption: option?.defaultOption ?? false,
          },
        ])
    );
  } else {
    visibleOptions.forEach(
      (option) => (lookupOptions[option.value] = _.get(option.label, "en", ""))
    );
  }
  return dataType === "stringLookup" ||
    dataType === "lookup" ||
    dataType === "multiSelectLookup"
    ? lookupOptionsStringLookup
    : lookupOptions;
};

function MultipleValuesLookupBox(
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
    allowLookupColourHex = false,
    onDataTypeChange = () => {},
    externalOptions = [],
    pickupListError,
    editModeValues,
    setEditModeValues,
    setPickupListError,
    ...props
  }: MultipleValuesLookupBoxProps,
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

  const handleNewOptionAdd = (
    label: string,
    value: string,
    colourHex: string
  ) => {
    let newItem = {
      id: (editModeValues.length ?? 0) + 1,
      label: { en: label },
      value,
      visible: true,
      newRecord: true,
      order: editModeValues.length,
      colourHex,
      defaultOption: false,
    };
    let updatedEditModeOptions: Option[] = [...editModeValues, { ...newItem }]
      ?.slice()
      .sort((item1, item2) => ((item1.id || NaN) < (item2.id || NaN) ? -1 : 1));
    let updatedLookupOptions: Option[] = [
      ...values["lookupOptions"],
      { ...newItem },
    ];
    setFieldValue(
      `addOptionsToLookupLabel${(editModeValues.length ?? 0) + 1}`,
      label
    );
    setFieldValue(
      `addOptionsToLookupVisible${(editModeValues.length ?? 0) + 1}`,
      true
    );
    setFieldValue(
      `addOptionsToLookupColourHex${(editModeValues.length ?? 0) + 1}`,
      colourHex
    );
    setFieldValue(name, setUpdatedOptions(updatedLookupOptions, dataType));
    setEditModeValues(updatedEditModeOptions);
  };

  const handleVisibilityUpdate = (
    item: Option,
    updatedVisibility?: boolean
  ) => {
    let updatedOptionsArray = [...editModeValues];
    const updatedOptionIndex = updatedOptionsArray.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: item.label,
      value: item.value,
      visible: !item.visible,
      newRecord: item.newRecord,
      order: item.order,
      colourHex: item.colourHex ?? "#000000",
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray, dataType));
    setEditModeValues(updatedOptionsArray);
  };

  const handleLabelChange = (item: Option, updatedLabel: string) => {
    let updatedOptionsArray = [...editModeValues];
    const updatedOptionIndex = updatedOptionsArray.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: { en: updatedLabel },
      value: item.value,
      visible: item.visible,
      newRecord: item.newRecord,
      order: item.order,
      colourHex: item.colourHex ?? "#000000",
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray, dataType));
    setEditModeValues(updatedOptionsArray);
  };

  const handleColourHexChange = (item: Option, updatedColourHex: string) => {
    let updatedOptionsArray = [...editModeValues];
    const updatedOptionIndex = updatedOptionsArray.findIndex(
      (editModeValue) => editModeValue.id === item.id
    );
    updatedOptionsArray[updatedOptionIndex] = {
      id: item.id,
      label: item.label,
      value: item.value,
      visible: item.visible,
      newRecord: item.newRecord,
      order: item.order,
      colourHex: updatedColourHex,
      defaultOption: item.defaultOption,
    };
    setFieldValue(name, setUpdatedOptions(updatedOptionsArray, dataType));
    setEditModeValues(updatedOptionsArray);
  };

  const handleUpArrow = (item: Option) => {
    let itemIndex = editModeValues?.findIndex(
      (value) => value?.id === item?.id
    );
    if (itemIndex !== -1) {
      let updatedEditModeValues: Option[] = [...editModeValues].sort((a, b) =>
        (a?.order ?? NaN) < (b?.order ?? NaN) ? -1 : 1
      );
      let itemIndex = updatedEditModeValues?.findIndex(
        (value) => value?.id === item?.id
      );
      const currentItem = {
        ...updatedEditModeValues[itemIndex],
        order: updatedEditModeValues[itemIndex - 1].order,
      };
      const previousItem = {
        ...updatedEditModeValues[itemIndex - 1],
        order: updatedEditModeValues[itemIndex].order,
      };
      updatedEditModeValues[itemIndex] = previousItem;
      updatedEditModeValues[itemIndex - 1] = currentItem;
      setFieldValue(name, setUpdatedOptions(updatedEditModeValues, dataType));
      setEditModeValues(updatedEditModeValues);
    }
  };

  const handleDownArrow = (item: Option) => {
    let itemIndex = editModeValues?.findIndex(
      (value) => value?.id === item?.id
    );
    if (itemIndex !== -1) {
      let updatedEditModeValues: Option[] = [...editModeValues].sort((a, b) =>
        (a?.order ?? NaN) < (b?.order ?? NaN) ? -1 : 1
      );
      let itemIndex = updatedEditModeValues?.findIndex(
        (value) => value?.id === item?.id
      );
      const currentItem = {
        ...updatedEditModeValues[itemIndex],
        order: updatedEditModeValues[itemIndex + 1].order,
      };
      const nextItem = {
        ...updatedEditModeValues[itemIndex + 1],
        order: updatedEditModeValues[itemIndex].order,
      };
      updatedEditModeValues[itemIndex] = nextItem;
      updatedEditModeValues[itemIndex + 1] = currentItem;
      setFieldValue(name, setUpdatedOptions(updatedEditModeValues, dataType));
      setEditModeValues(updatedEditModeValues);
    }
  };

  useEffect(() => {
    let itemCount = 1;
    let editValues: Option[] = [];
    if (values[name] && editMode) {
      let key: any;
      if (dataType === "stringLookup") {
        values[name].map((option: any) => {
          setFieldValue(`addOptionsToLookupLabel${itemCount}`, option.label.en);
          setFieldValue(`addOptionsToLookupVisible${itemCount}`, true);
          setFieldValue(
            `addOptionsToLookupColourHex${itemCount}`,
            option.colourHex ?? "#000000"
          );
          let itemCounter = itemCount++;
          editValues = [
            ...editValues,
            {
              id: itemCounter,
              value: option.key,
              label: option.label,
              visible: true,
              newRecord: false,
              order: option?.order ?? itemCounter,
              colourHex: option?.colourHex ?? "#000000",
              defaultOption: option.defaultOption,
            },
          ];
        });
      } else if (dataType === "lookup" || dataType === "multiSelectLookup") {
        values[name].map((option: any) => {
          setFieldValue(`addOptionsToLookupLabel${itemCount}`, option.label.en);
          setFieldValue(
            `addOptionsToLookupVisible${itemCount}`,
            option.recordStatus === "a"
          );
          setFieldValue(
            `addOptionsToLookupColourHex${itemCount}`,
            option.colourHex ?? "#000000"
          );
          let itemCounter = itemCount++;
          editValues = [
            ...editValues,
            {
              id: itemCounter,
              value: option.id,
              label: option.label,
              visible: option.recordStatus === "a",
              newRecord: false,
              order: option?.order ?? itemCounter,
              colourHex: option?.colourHex ?? "#000000",
              defaultOption: option.defaultOption,
            },
          ];
        });
      } else {
        for (key of Object.keys(values[name])) {
          setFieldValue(
            `addOptionsToLookupLabel${itemCount}`,
            values[name][key]
          );
          setFieldValue(`addOptionsToLookupVisible${itemCount}`, true);
          let itemCounter = itemCount++;
          editValues.push({
            id: itemCounter,
            label: { en: values[name][key] },
            value: key,
            visible: true,
            newRecord: false,
            order: itemCounter,
            colourHex: "#000000",
            defaultOption: false,
          });
        }
      }
    }
    setFieldValue(name, setUpdatedOptions([...editValues], dataType));
    setEditModeValues([...editValues]);
    if (dataTypeChanged) {
      onDataTypeChange();
    }
  }, [editMode, dataTypeChanged, externalOptions, dataType]);

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
    editModeValues,
    isValid,
    error,
    pickupListError,
    allowLookupColourHex,
    handleNewOptionAdd,
    handleColourHexChange,
    setFieldValue,
    setPickupListError,
    handleChange,
    handleLabelChange,
    handleVisibilityUpdate,
    handleUpArrow,
    handleDownArrow,
  };
  return <MultiValuesLookupBoxPresentational {...uiProps} />;
}
export default React.forwardRef(MultipleValuesLookupBox);
