import { FormikValues } from "formik";

export const getEditConfig = (executeWhen: string, values: FormikValues) => {
  if (executeWhen === "create_update") {
    return {
      triggerOnEdit: true,
      configType: values.executeWhen,
    };
  } else if (executeWhen === "update") {
    const filterValue =
      values.executeWhenEditMoreOptions === "specific"
        ? values.specifiedFieldCondition.map(
            (val: {
              name: string;
              operator: string;
              value: string | null;
              anyValue: boolean;
              logicalOperator: string | null;
              metadata: string | null;
            }) => {
              return {
                name: val.name,
                operator: val.operator,
                value: val.value,
                logicalOperator: val.logicalOperator || null,
                metadata: val.metadata || null,
              };
            }
          )
        : [];
    return {
      configType: values.executeWhen,
      anyField: values.executeWhenEditMoreOptions === "any" ? true : false,
      filters: filterValue,
      expression: values["expressionWFExecute"],
      specifiedFieldCondition:
        values.executeWhenEditMoreOptions === "specific"
          ? values.specifiedFieldCondition.map(
              (val: {
                name: string;
                operator: string;
                value: string | null;
                logicalOperator: string | null;
                anyValue: boolean;
              }) => {
                return {
                  anyValue: val.anyValue,
                  targetField: val.name,
                  targetCondition: val.operator,
                  targetValue: val.value,
                  logicalOperator: val.logicalOperator || null,
                };
              }
            )
          : [],
    };
  }
};
