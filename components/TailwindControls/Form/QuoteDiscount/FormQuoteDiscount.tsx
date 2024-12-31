import React from "react";
import { useFormikContext } from "formik";
import QuoteDiscount, { QuoteDiscountProps } from "./QuoteDiscount";

export default function FormQuoteDiscount(props: QuoteDiscountProps) {
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
  return <QuoteDiscount {...mergedProps} />;
}
