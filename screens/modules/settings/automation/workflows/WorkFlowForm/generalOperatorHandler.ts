export const generalOperatorHandler = (
  operatorValue: string,
  datatype: string
) => {
  if (operatorValue === "any") {
    return "eq";
  } else if (
    ["date", "datetime"].includes(datatype) &&
    ["d_t", "d_yd", "d_tw", "d_lw", "d_tm", "d_lm", "d_ty", "d_ly"].includes(
      operatorValue
    )
  ) {
    return "between";
  } else return operatorValue;
};
