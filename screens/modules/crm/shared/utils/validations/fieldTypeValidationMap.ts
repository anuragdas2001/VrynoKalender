import { recordImageValidations } from "./recordImageValidations";
import * as Yup from "yup";
import { Schema } from "yup";
import { numberValidations } from "./numberValidations";
import { stringValidations } from "./stringValidations";
import { recordLookupValidations } from "./recordLookupValidations";
import { lookupValidations } from "./lookupValidations";
import { datetimeValidations } from "./datetimeValidations";
import { imageValidations } from "./imageValidations";
import { dateValidations } from "./dateValidations";
import { emailValidations } from "./emailValidations";
import { stringLookupValidations } from "./stringLookupValidations";
import { phoneNumberValidations } from "./phoneNumberValidation";
import { textAreaValidations } from "./textAreaValidation";
import { richtextValidations } from "./richtextValidations";
import { multiSelectRecordLookupValidations } from "./multiSelectRecordLookupValidations";
import { multiSelectLookupValidations } from "./multiSelectLookupValidations";
import { relatedToValidations } from "./relatedToValidations";
import {
  ICustomField,
  ICustomFieldValidation,
} from "../../../../../../models/ICustomField";
import { urlValidations } from "./urlValidations";
import { jsonDateTimeValidations } from "./jsonDateTimeValidations";

type ValidationConverterTypes<TValSchema> = Array<
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: TValSchema,
    field?: ICustomField
  ) => TValSchema
>;

const mandatoryValidation = <TValSchema extends Schema>(
  customField: ICustomField,
  validation: TValSchema,
  label: string,
  fieldList?: ICustomField[],
  modelName?: string
): TValSchema => {
  if (customField.dataType === "expression") {
    let updatedFieldNameExpression: string[] =
      customField?.dataTypeMetadata?.expression?.split(" ");
    let mandatoryFlag: boolean = true;
    updatedFieldNameExpression?.forEach((fieldName) => {
      const findIndex = fieldList?.findIndex(
        (field) => `${modelName}.${field.name}` === fieldName
      );
      if (findIndex === -1) {
      } else if (fieldList && findIndex && !fieldList[findIndex]?.mandatory) {
        mandatoryFlag = false;
      }
    });
    if (mandatoryFlag) {
      return validation
        .transform((value, originalValue) => {
          if (typeof value === "string" && value.trim() === "") {
            return null; // Convert empty string to null
          }
          return value;
        })
        .nullable()
        .required(`${label} is required`);
    }
    return validation.nullable();
  }
  if (customField.mandatory) {
    return validation
      .transform((value, originalValue) => {
        if (typeof value === "string" && value.trim() === "") {
          return null; // Convert empty string to null
        }
        return value;
      })
      .nullable()
      .required(`${label} is required`);
  }
  return validation.nullable();
};

const validationReducer = <TValSchema>(
  customField: ICustomField,
  fieldLabel: string,
  initVal: TValSchema | any,
  validationTypes: ValidationConverterTypes<TValSchema>
) =>
  validationTypes.reduce(
    (oneValidation, validationConverter) =>
      validationConverter(
        customField.validations,
        fieldLabel,
        oneValidation,
        customField
      ),
    initVal
  );

export const fieldTypeValidationMap = {
  emailType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      emailValidations
    );
  },
  urlType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      urlValidations
    );
  },
  numberType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.number(), fieldLabel),
      numberValidations
    );
  },
  singlelineType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      stringValidations
    );
  },
  // expressionType: (
  //   customField: ICustomField,
  //   fieldLabel: string,
  //   fieldList?: ICustomField[],
  //   modelName?: string
  // ) => {
  //   return validationReducer(
  //     customField,
  //     fieldLabel,
  //     mandatoryValidation(
  //       customField,
  //       Yup.string(),
  //       fieldLabel,
  //       fieldList,
  //       modelName
  //     ),
  //     stringValidations
  //   );
  // },
  multilineType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      textAreaValidations
    );
  },
  imageType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      imageValidations
    );
  },
  phoneNumberType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      phoneNumberValidations
    );
  },
  recordImageType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      recordImageValidations
    );
  },
  datetimeType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.date(), fieldLabel),
      datetimeValidations
    );
  },
  dateType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.date(), fieldLabel),
      dateValidations
    );
  },
  lookupType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      lookupValidations
    );
  },
  multiSelectLookupType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      customField?.mandatory
        ? Yup.array(Yup.string())
            .min(1, `${fieldLabel} is required`)
            .required(`${fieldLabel} is required`)
            .nullable()
        : Yup.array(Yup.string()).nullable(),
      multiSelectLookupValidations
    );
  },
  stringLookupType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      stringLookupValidations
    );
  },
  recordLookupType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(customField, Yup.string(), fieldLabel),
      recordLookupValidations
    );
  },
  multiSelectRecordLookupType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      customField?.mandatory
        ? Yup.array(Yup.string())
            .min(1, `${fieldLabel} is required`)
            .required(`${fieldLabel} is required`)
            .nullable()
        : Yup.array(Yup.string()).nullable(),
      multiSelectRecordLookupValidations
    );
  },
  jsonDateTimeType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(
        customField,
        customField.mandatory
          ? Yup.object()
              .shape({
                executorField: Yup.string().required(
                  `${fieldLabel} is required`
                ),
                // adjust: Yup.object().shape({
                //   type: Yup.string()
                //     .nullable()
                //     .required(`${fieldLabel} is required`),
                // }),
              })
              .required(`${fieldLabel} is required`)
          : Yup.object().shape({}).nullable(),
        fieldLabel
      ),
      jsonDateTimeValidations
    );
  },
  richTextType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(
        customField,
        customField.mandatory
          ? Yup.object()
              .shape({
                type: Yup.string().required(`${fieldLabel} is required`),
                content: Yup.array()
                  .required(`${fieldLabel} is required`)
                  .min(1, `${fieldLabel} is required`),
              })
              .nullable()
          : Yup.object().shape({}).nullable(),
        fieldLabel
      ),
      richtextValidations
    );
  },
  relatedToType: (
    customField: ICustomField,
    fieldLabel: string,
    fieldList?: ICustomField[],
    modelName?: string
  ) => {
    return validationReducer(
      customField,
      fieldLabel,
      mandatoryValidation(
        customField,
        Yup.array()
          .of(
            Yup.object().shape({
              moduleName: Yup.string(),
              recordId: Yup.string(),
            })
          )
          // .compact((v) => !v.checked)
          .required(`${fieldLabel} is required`)
          .min(1, `${fieldLabel} is required`)
          .nullable(),
        fieldLabel
      ),
      relatedToValidations
    );
  },
};
