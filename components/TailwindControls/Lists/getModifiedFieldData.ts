import { get } from "lodash";
import { ICustomField } from "../../../models/ICustomField";
import { parse } from "expression-eval";
import { evaluateBinaryExpression } from "../../../screens/modules/crm/shared/components/ReadOnly/EvaluateExpressionType";

export const getModifiedFieldData = (data: any, field: ICustomField) => {
  // SINGLELINE, MULTILINE, NUMBER, EMAIL
  if (
    field.dataType === "singleline" ||
    field.dataType === "multiline" ||
    field.dataType === "number" ||
    field.dataType === "email"
  ) {
    if (field.expression) {
      const fieldExpression = field.expression;
      const fieldsInExpression: any = parse(fieldExpression);
      return data[field.value] || get(data, field.value)
        ? field.dataType === "number" &&
          field?.dataTypeMetadata?.precision !== null
          ? Number(data[field.value])?.toFixed(
              field?.dataTypeMetadata?.precision ?? 0
            ) ||
            Number(get(data, field.value))?.toFixed(
              field?.dataTypeMetadata?.precision ?? 0
            )
          : data[field.value] || get(data, field.value)
        : fieldsInExpression?.type === "BinaryExpression"
        ? evaluateBinaryExpression(
            data,
            fieldsInExpression?.left,
            fieldsInExpression?.right,
            fieldsInExpression?.operator
          )
        : "-";
    } else if (Array.isArray(data[field.value]) && data[field.value].length) {
      return data[field.value].map(
        (item: string, index: number) =>
          `${index !== 0 ? ", " : ""}${
            field.dataType === "number" &&
            field?.dataTypeMetadata?.precision !== null
              ? Number(item)?.toFixed(field?.dataTypeMetadata?.precision ?? 0)
              : item
          }`
      );
    } else if (
      (data[field.value] || get(data, field.value)) &&
      field.dataType === "email"
    ) {
      return data[field.value] || get(data, field.value);
    } else {
      field?.dataType === "number"
        ? typeof (data[field.value] || get(data, field.value)) === "number"
          ? field?.dataTypeMetadata?.precision !== null
            ? Number(data[field.value])?.toFixed(
                field?.dataTypeMetadata?.precision ?? 0
              ) ||
              Number(get(data, field.value))?.toFixed(
                field?.dataTypeMetadata?.precision ?? 0
              )
            : Number(data[field.value] || get(data, field.value))
          : data[field.value] || get(data, field.value)
          ? field?.dataTypeMetadata?.precision !== null
            ? data[field.value] || get(data, field.value)
            : Number(data[field.value] || get(data, field.value))?.toFixed(
                field?.dataTypeMetadata?.precision ?? 0
              )
          : "-"
        : typeof (data[field.value] || get(data, field.value)) === "number"
        ? Number(data[field.value] || get(data, field.value))
        : (data[field.value] && typeof data[field.value] === "string") ||
          (get(data, field.value) && typeof get(data, field.value) === "string")
        ? data[field.value] || get(data, field.value) || "-"
        : "-";
    }
  }

  return data[field.value] || get(data, field.value);
};
