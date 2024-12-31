import React from "react";
import { useFormikContext } from "formik";
import Checkbox, { CheckboxProps } from "./CheckBox";

export default function FormCheckBox(props: CheckboxProps) {
  const { handleChange, errors, touched, setFieldTouched, values } =
    useFormikContext<Record<string, any>>();

  const mergedProps = {
    onBlur: () => {
      setFieldTouched(props.name);
    },
    onChange: (e: React.ChangeEvent<any>) => {
      handleChange(e);
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name] as string,
    value: values[props.name],
    ...props,
  };
  return <Checkbox {...mergedProps} />;
}
