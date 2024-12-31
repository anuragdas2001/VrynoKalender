import { getDataObject } from "../../utils/getDataObject";
import { getNamesOnlyFromField } from "../../utils/getFieldsArray";

export const recordLookupSearchResultDataExtractor = (
  fieldDisplayExpression: string[],
  searchBy: string[],
  data: Record<string, any>
) => {
  searchBy = getNamesOnlyFromField(searchBy);
  data = getDataObject(data);
  let hasNoExpressionData = true;

  // fde = ['linkedIn', 'singleLineOne'] sb = ['linkedIn', 'singleLineOne', 'name'] =>  __expression_data_not_found__
  // fde = ['linkedIn', 'singleLineOne'] sb = ['linkedIn', 'name'] =>  __field_expression_not_found__
  // fde = ['linkedIn', 'singleLineOne'] sb = ['name'] => __field_expression_not_found__

  const foundFields: string[] = [];

  for (const fieldExp of fieldDisplayExpression) {
    if (searchBy.includes(fieldExp)) {
      foundFields.push(fieldExp);
    }
  }

  if (!foundFields.length) {
    return {
      ...data,
      __field_expression_not_found__: true,
      __field_expression_not_found_message__: `Field display expression ${fieldDisplayExpression.join(
        ","
      )} not found`,
    };
  }

  const notFoundFields = [...fieldDisplayExpression].filter(
    (fieldName) => !foundFields.includes(fieldName)
  );

  for (const fieldName of fieldDisplayExpression) {
    if (data[fieldName] && hasNoExpressionData) {
      hasNoExpressionData = false;
      break;
    }
  }

  const updatedResponseData: Record<string, any> = {};
  if (!hasNoExpressionData && fieldDisplayExpression) {
    for (const fieldName of fieldDisplayExpression) {
      updatedResponseData[fieldName] = data[fieldName];
    }
    updatedResponseData["id"] = data["id"];
  }

  return fieldDisplayExpression?.length === foundFields.length &&
    hasNoExpressionData
    ? {
        ...data,
        __expression_data_not_found__: true,
        __expression_data_not_found_message__: `Search by field data ${fieldDisplayExpression.join(
          ","
        )} not found`,
      }
    : hasNoExpressionData
    ? {
        ...data,
        __field_expression_not_found__: true,
        __field_expression_not_found_message__: `Field display expression ${notFoundFields.join(
          ","
        )} not found`,
      }
    : updatedResponseData;
};
