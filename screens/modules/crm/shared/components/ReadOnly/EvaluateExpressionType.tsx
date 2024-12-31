import {} from "expression-eval";
import React from "react";
import { NoDataControl } from "./NoDataControl";

export type EvaluateExpressionTypeProps = {
  data: any;
  expression: any;
  fontSize: { header: string; value: string };
};

export const evaluateBinaryExpression: any = (
  data: any,
  leftExpression: Record<any, any>,
  rightExpression: Record<any, any>,
  operator: string,
  fontSize?: { header: string; value: string },
  expression?: any
) => {
  if (leftExpression?.value && rightExpression?.value) {
    return eval(`${leftExpression.value}${operator}${rightExpression.value}`);
  } else if (leftExpression?.name && rightExpression?.name) {
    return eval(
      `${data[leftExpression?.name]}${operator}${data[rightExpression?.name]}`
    );
  } else if (leftExpression?.name || leftExpression?.value) {
    return eval(
      `${
        leftExpression?.value
          ? leftExpression.value
          : data[leftExpression?.name]
      }${operator}${evaluateBinaryExpression(
        data,
        rightExpression?.left,
        rightExpression?.right,
        rightExpression?.operator
      )}`
    );
  } else if (rightExpression?.name || rightExpression?.value) {
    return eval(
      `${evaluateBinaryExpression(
        data,
        leftExpression?.left,
        leftExpression?.right,
        leftExpression?.operator
      )}${operator}${
        rightExpression?.value
          ? rightExpression.value
          : data[rightExpression?.name]
      }`
    );
  }
};

export const EvaluateExpressionType = ({
  data,
  expression,
  fontSize,
}: EvaluateExpressionTypeProps) => {
  const typeComponent: Record<any, any> = {
    BinaryExpression: evaluateBinaryExpression(
      data,
      expression?.left,
      expression?.right,
      expression?.operator,
      fontSize,
      expression
    ),
  };
  return (
    typeComponent[expression.type] || <NoDataControl fontSize={fontSize} />
  );
};
