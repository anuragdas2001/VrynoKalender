import React from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";

export type MultipleKeyValueInputBoxProps = {
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
  dataTypeChanged?: boolean;
  onDataTypeChange?: () => void;
  externalOptions?: { value: string; label: string }[];
};
