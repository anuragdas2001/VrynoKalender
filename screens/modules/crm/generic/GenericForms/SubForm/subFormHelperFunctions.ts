import { range } from "lodash";
import { SubFormOperationHandlerProps } from "../Shared/genericFormProps";
import { getDefaultFieldValuePerDatatype } from "../../../shared/utils/getInitialValuesFromList";

export const handleAddSubForm = ({
  num,
  subFormData,
  values,
  totalSubForms = 1,
  setFieldValue,
  setTotalSubForms,
}: SubFormOperationHandlerProps) => {
  if (num + 1 < totalSubForms) {
    const totalSubFormCount = totalSubForms;
    setTotalSubForms((totalSubForms ?? 1) + 1);
    range((totalSubFormCount ?? 1) + 1, num + 1)?.forEach((value) => {
      subFormData &&
        Object.keys(subFormData)?.length > 0 &&
        Object.keys(subFormData)?.forEach((data) => {
          subFormData[data]?.fieldsList?.forEach((field) =>
            setFieldValue(
              `${field.name}SubForm${value}`,
              values[`${field.name}SubForm${value - 1}`]
            )
          );
          setFieldValue(
            `discount-type-discountSubForm${value}`,
            values[`discount-type-discountSubForm${value - 1}`]
          );
          setFieldValue(
            `discount-input-discountSubForm${value}`,
            values[`discount-input-discountSubForm${value - 1}`]
          );
          setFieldValue(`idSubForm${value}`, values[`idSubForm${value - 1}`]);
        });
    });
    subFormData &&
      Object.keys(subFormData)?.length > 0 &&
      Object.keys(subFormData)?.forEach((data) => {
        subFormData[data]?.fieldsList?.forEach((field) =>
          setFieldValue(
            `${field.name}SubForm${num + 1}`,
            getDefaultFieldValuePerDatatype(field)
          )
        );
      });
    setFieldValue(`tax-taxesSubForm${num + 1}`, null);
    setFieldValue(`discount-type-discountSubForm${num + 1}`, null);
    setFieldValue(`discount-input-discountSubForm${num + 1}`, null);
    setFieldValue(`idSubForm${num + 1}`, null);
  } else {
    setTotalSubForms((totalSubForms ?? 1) + 1);
  }
};

export const handleSubtractSubForm = ({
  num,
  subFormData,
  values,
  totalSubForms,
  setFieldValue,
  setTotalSubForms,
}: SubFormOperationHandlerProps) => {
  range(num, (totalSubForms ?? 1) - 1)?.forEach((value) => {
    subFormData &&
      Object.keys(subFormData)?.length > 0 &&
      Object.keys(subFormData)?.forEach((data) => {
        subFormData[data]?.fieldsList?.forEach((field) =>
          setFieldValue(
            `${field.name}SubForm${value}`,
            values[`${field.name}SubForm${value + 1}`]
          )
        );
        setFieldValue(
          `discount-type-discountSubForm${value}`,
          values[`discount-type-discountSubForm${value + 1}`]
        );
        setFieldValue(
          `discount-input-discountSubForm${value}`,
          values[`discount-input-discountSubForm${value + 1}`]
        );
        setFieldValue(`idSubForm${value}`, values[`idSubForm${value + 1}`]);
      });
  });
  subFormData &&
    Object.keys(subFormData)?.length > 0 &&
    Object.keys(subFormData)?.forEach((data) => {
      subFormData[data]?.fieldsList?.forEach((field) =>
        setFieldValue(
          `${field.name}SubForm${(totalSubForms ?? 1) - 1}`,
          getDefaultFieldValuePerDatatype(field)
        )
      );
    });
  setTotalSubForms((totalSubForms ?? 1) - 1);
};
