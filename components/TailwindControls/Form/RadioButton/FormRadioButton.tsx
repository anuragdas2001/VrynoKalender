import React from "react";
import { useFormikContext } from "formik";
import RadioButton, { RadioButtonProps } from "./RadioButton";

export default function FormRadioButton(
  props: RadioButtonProps & { inputRef?: React.Ref<any> }
) {
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
    onChange: (e: React.ChangeEvent<any>) => {
      handleChange(e);
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name],
    value: values[props.name],
    ...props,
  };
  const { inputRef, ...rest } = mergedProps;
  return <RadioButton {...rest} ref={inputRef} />;
}
