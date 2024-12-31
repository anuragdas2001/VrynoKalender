import _ from "lodash";
import { IndexExpressionMapper } from "../../GenericAddCustomView/customViewHelpers/customViewShared";

export const updateFilterExpression = (
  fieldList: any[],
  currentExpression: string,
  filters: any
) => {
  let updatedExpression = currentExpression;
  fieldList.forEach((filter) => (updatedExpression = "( " + updatedExpression));
  fieldList.forEach(
    (filter, index) =>
      (updatedExpression =
        updatedExpression +
        ((_.get(filters, "length", 0) > 0 || updatedExpression !== "") &&
        (_.get(filters, "length", 0) > 0 || index !== 0)
          ? ` and ${
              IndexExpressionMapper[(filters?.length ?? 0) + index + 1]
            } ) `
          : `${IndexExpressionMapper[(filters?.length ?? 0) + index + 1]} ) `))
  );
  return updatedExpression;
};
