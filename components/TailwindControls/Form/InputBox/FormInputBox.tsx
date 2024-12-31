import React from "react";
import { useFormikContext } from "formik";
import InputBox, { InputBoxProps } from "./InputBox";

export default function FormInputBox(
  props: InputBoxProps & { inputRef?: React.Ref<any> }
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
      // Type number with empty value to set default to null
      if (e.target.value === "" && props.type === "number") {
        setFieldValue(props.name, null);
        return;
      }
      // For any type that is not number
      if (props.type !== "number") {
        handleChange(e);
        return;
      }

      const findIndexOfdecimal = Number(
        String(e.target.value)?.lastIndexOf(".")
      );

      // For All fields
      if (props.type === "number" && e.target.value > 2147483647) return;

      if (
        props.type === "number" &&
        findIndexOfdecimal === -1 &&
        String(e.target.value)?.length <= 10
      ) {
        handleChange(e);
        return;
      }

      if (props.type === "number" && findIndexOfdecimal !== -1) {
        if (
          String(e.target.value)?.length <=
          Number(11 + Number(props.precision ?? 0))
        ) {
          handleChange(e);
          return;
        } else return;
      }
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name],
    value: values[props.name],
    ...props,
  };
  const { inputRef, ...rest } = mergedProps;
  return <InputBox {...rest} ref={inputRef} />;
}
