import React from "react";
import { useFormikContext } from "formik";
import ReactDatePicker, { DatePickerProps } from "./DatePicker";

export default function FormDatePicker(props: DatePickerProps) {
  const {
    handleChange,
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    values,
  } = useFormikContext<Record<string, string>>();

  const mergedProps = {
    onBlur: () => {
      setFieldTouched(props.name);
    },
    onChange: (
      date: Date | null,
      event: React.SyntheticEvent<any> | undefined
    ) => {
      setFieldValue(props.name, date);
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name],
    value: values[props.name],
    ...props,
  };
  return <ReactDatePicker {...mergedProps} />;
}
