const ModelNameMapper: {
  [modelName: string]: { subForm: string; subFormFieldLinked: string };
} = {
  quote: { subForm: "quoted-Item", subFormFieldLinked: "quote-id" },
  invoice: { subForm: "invoiced-Item", subFormFieldLinked: "invoice-id" },
  salesOrder: { subForm: "ordered-Item", subFormFieldLinked: "sales-order-id" },
  purchaseOrder: {
    subForm: "purchase-Item",
    subFormFieldLinked: "purchase-id",
  },
};

export const modelNameValuesWithSystemSubForm = [
  "quote",
  "invoice",
  "salesOrder",
  "purchaseOrder",
];

export const modelNameMapperForParamURLGenerator = (modelName: string) => {
  return ModelNameMapper[modelName];
};

export const reverseLookupURLGenerator = ({
  dependentField,
  subFormName,
  dependingModule,
}: {
  dependentField: {
    parentDependentField: string;
    parentDependentFieldValue: string;
  }[];
  subFormName: string;
  dependingModule: string;
}) => {
  let paramUrl = "?";
  dependentField?.forEach(
    (dependent) =>
      (paramUrl += `parentDependentField=${dependent.parentDependentField}&&parentDependentFieldValue=${dependent.parentDependentFieldValue}&&`)
  );
  return paramUrl.concat(
    `subform=${subFormName}&&dependingModule=${dependingModule}`
  );
};
