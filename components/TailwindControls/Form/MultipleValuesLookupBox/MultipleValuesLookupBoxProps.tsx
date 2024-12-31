import React from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";

type OptionId = string | number | null;

export type Option<T = OptionId> = {
  id: T;
  label: { en: string };
  value: string;
  visible: boolean;
  newRecord: boolean;
  order?: number;
  colourHex?: string;
  defaultOption: boolean;
  recordStatus?: string;
};

export type MultipleValuesLookupBoxProps = {
  name: string;
  placeholder?: string;
  type: string;
  label?: string;
  editMode?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  rightIconClick?: () => void;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  usedInForm?: boolean;
  dataType?: string;
  allowLookupColourHex?: boolean;
  dataTypeChanged?: boolean;
  onDataTypeChange?: () => void;
  externalOptions?: { value: string; label: string }[];
  pickupListError?: { error: boolean; fieldName: string }[];
  editModeValues: Option[];
  setEditModeValues: (values: Option[]) => void;
  setPickupListError?: (value: { error: boolean; fieldName: string }) => void;
};
