import React from "react";
import { useFormikContext } from "formik";
import Dropdown, { DropdownProps } from "./Dropdown";

export default function FormDropdown(props: DropdownProps) {
  const {
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    values,
    handleChange,
  } = useFormikContext<Record<string, string>>();
  const mergedProps = {
    onBlur: () => {
      setFieldTouched(props.name);
    },
    onChange: (selectedOption: React.ChangeEvent<any>) => {
      setFieldValue(props.name, selectedOption.target.value);
    },
    ...props,
  };
  return <Dropdown {...mergedProps} />;
}
