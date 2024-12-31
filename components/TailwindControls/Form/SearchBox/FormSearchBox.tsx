import React from "react";
import { useFormikContext } from "formik";
import SearchBox from "./SearchBox";
import { BasicLookupType, SearchBoxProps } from "./SearchBoxProps";

export default function FormSearchBox<T extends BasicLookupType>(
  props: SearchBoxProps<T>
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
  return <SearchBox {...mergedProps} />;
}
