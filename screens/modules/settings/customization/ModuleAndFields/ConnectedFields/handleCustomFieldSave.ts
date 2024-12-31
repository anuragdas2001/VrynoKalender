import { AccountModels } from "./../../../../../../models/Accounts";
import moment from "moment";
import { ICustomField } from "../../../../../../models/ICustomField";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";

export const getDisplayExpression = (expresionArray: string[]) => {
  let expression = "";
  for (let index = 0; index < expresionArray.length; index++) {
    expression = expression + "${" + expresionArray[index] + "} ";
  }
  return expression;
};

const getHighestOrderFromField = (fieldList: ICustomField[]) => {
  let highestOrder: number = -9999;
  fieldList?.forEach((field) =>
    highestOrder > field.order
      ? (highestOrder = highestOrder)
      : (highestOrder = field.order)
  );
  return highestOrder;
};

const handleCustomFieldSave = (
  values: Record<string, string | string[] | any>,
  editMode: boolean,
  fieldList: ICustomField[],
  data: any,
  timezone?: string
) => {
  let saveInput = <any>{
    moduleName: `${values.moduleName}`,
    label: {
      en: values.label,
    },
    order: !editMode ? getHighestOrderFromField(fieldList) + 1 : values.order,
    name: editMode ? values.name : "Custom " + values.label,
    mandatory: values.mandatory,
    lookupValues: values.lookupValues,
    checkDuplicacy: values.checkDuplicacy,
    showInQuickCreate: values.showInQuickCreate,
    visible: values.visible,
    dataType: values.dataType,
    isMasked: values.isMasked || false,
    readOnly: values.readOnly,
    maskedPattern: values.isMasked ? values?.maskedPattern ?? "x" : null,
    dataTypeMetadata:
      values.dataType === "recordLookup" ||
      values.dataType === "multiSelectRecordLookup"
        ? {
            allLookups: [
              {
                additionalFilters: {},
                displayExpression:
                  values?.searchByFields && values?.searchByFields?.length > 0
                    ? getDisplayExpression(values?.searchByFields)
                    : values?.recordLookupModule === AccountModels.User
                    ? "${firstName} ${lastName}"
                    : "${name}",
                fieldName: values?.recordLookupFields?.length
                  ? values.recordLookupFields
                  : ["name"],
                moduleName: `${values?.recordLookupAppName}.${values?.recordLookupModule}`,
                displayInReverseLookupAs: values.displayInReverseLookupAs
                  ? values.displayInReverseLookupAs
                  : "",
              },
            ],
            isSubform: values.isSubform ? values.isSubform : false,
          }
        : values.dataType === "stringLookup"
        ? values.lookupOptions
        : values.dataType === "lookup" ||
          values.dataType === "multiSelectLookup"
        ? {
            allLookups: editMode
              ? data?.dataTypeMetadata?.allLookups?.length > 0
                ? [
                    {
                      ...data?.dataTypeMetadata?.allLookups[0],
                      displayExpression: "${defaultLabel}",
                    },
                  ]
                : [{ displayExpression: "${defaultLabel}" }]
              : [{ displayExpression: "${defaultLabel}" }],
            lookupOptions: values.lookupOptions,
            allowColour: values.allowColour ?? false,
          }
        : values.dataType === "autoNumber"
        ? {
            prefix: values.prefix,
            suffix: values.suffix,
            padding: {
              frequency: values.paddingLength,
              character: values.paddingCharacter,
            },
          }
        : values.dataType === "number"
        ? {
            precision:
              values?.numberPrecision && values?.numberPrecision !== "undefined"
                ? values?.numberPrecision
                : 0,
          }
        : values.dataType === "expression"
        ? {
            expression: values?.formulaBuilder,
            format: {
              type: "number",
              precision:
                values?.numberPrecision &&
                values?.numberPrecision !== "undefined"
                  ? values?.numberPrecision
                  : 0,
              ratio: "absolute",
            },
          }
        : null,
  };
  let validations = <any>{};
  if (
    ["string", "singleline", "multiline", "number"].includes(values.dataType)
  ) {
    if (typeof values.minVal === "number")
      validations["minVal"] = values.minVal;
    if (typeof values.maxVal === "number")
      validations["maxVal"] = values.maxVal;
    if (values.matches && values.dataType !== "number")
      validations["matches"] = values.matches;
  }
  if (["datetime"].includes(values.dataType)) {
    if (values.minVal)
      validations["minVal"] = timezone
        ? getCorrectTimezone(values.minVal, timezone)
        : moment(values.minVal).toISOString();
    if (values.maxVal)
      validations["maxVal"] = timezone
        ? getCorrectTimezone(values.maxVal, timezone)
        : moment(values.maxVal).toISOString();
  }
  if (["date"].includes(values.dataType)) {
    if (values.minVal)
      validations["minVal"] = moment(values.minVal).format("YYYY-MM-DD");
    if (values.maxVal)
      validations["maxVal"] = moment(values.maxVal).format("YYYY-MM-DD");
  }
  saveInput["validations"] = validations;
  return saveInput;
};
export default handleCustomFieldSave;
