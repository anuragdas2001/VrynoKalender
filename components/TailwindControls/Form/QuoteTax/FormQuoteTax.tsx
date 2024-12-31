import React from "react";
import { useFormikContext } from "formik";
import QuoteTax, { QuoteTaxProps } from "./QuoteTax";

export default function FormQuoteTax(props: QuoteTaxProps) {
  const { errors, touched, setFieldTouched, values } =
    useFormikContext<Record<string, string>>();
  const mergedProps = {
    onBlur: () => {
      setFieldTouched(props.name);
    },
    isValid: touched[props.name] ? errors[props.name] === undefined : true,
    error: errors[props.name],
    value: values[props.name],
    ...props,
  };
  return <QuoteTax {...mergedProps} />;
}
