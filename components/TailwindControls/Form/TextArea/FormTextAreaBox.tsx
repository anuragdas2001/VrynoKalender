import React from "react";
import { useFormikContext } from "formik";
import TextAreaBox, { TextAreaBoxProps } from "./TextAreaBox";

export default function FormTextAreaBox(props: TextAreaBoxProps) {
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
  return <TextAreaBox {...mergedProps} />;
}
