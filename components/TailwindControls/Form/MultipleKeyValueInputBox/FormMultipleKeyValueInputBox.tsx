import React from "react";
import { useFormikContext } from "formik";
import MultipleKeyValueInputBox from "./MultipleKeyValueInputBox";
import { MultipleKeyValueInputBoxProps } from "./MultipleKeyValueInputBoxProps";

export default function FormMultipleKeyValueInputBox(
  props: MultipleKeyValueInputBoxProps
) {
  const { handleChange, errors, touched, setFieldTouched, values } =
    useFormikContext<Record<string, string>>();
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
  return <MultipleKeyValueInputBox {...mergedProps} />;
}
