import React from "react";
import { useFormikContext } from "formik";
import MultipleValuesDropdown, {
  MultipleValuesDropdownProps,
} from "./MultipleValuesDropdown";

export default function FormMultipleValuesDropdown(
  props: MultipleValuesDropdownProps
) {
  const {
    handleChange,
    errors,
    touched,
    setFieldTouched,
    values,
    setFieldValue,
  } = useFormikContext<Record<string, string>>();
  const mergedProps = {
    onBlur: () => {
      setFieldTouched(props.name);
    },
    onChange: (selectedOption: React.ChangeEvent<any>) => {
      setFieldValue(props.name, selectedOption.target.value);
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name],
    value: values[props.name],
    ...props,
  };
  return <MultipleValuesDropdown {...mergedProps} />;
}
