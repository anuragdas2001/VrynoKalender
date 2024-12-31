import { ICustomField } from "../../../../../../models/ICustomField";
import { lookupMapper } from "../../../shared/utils/staticLookupMapper";
import {
  GenericFormSaveResponseProps,
  handleFetchQuoteSubformFieldsProps,
} from "./genericFormProps";
import { camelCase, range, startCase, toLower } from "lodash";
import { FormikValues } from "formik";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { updateBackgroundProcessingInSession } from "../../../../shared";
import { getSortedFieldList } from "../../../shared/utils/getOrderedFieldsList";

export const getDefaultDropdowns = (fieldsList: ICustomField[]) => {
  let defaultDropdowns: Record<string, any> = {
    fields: {},
  };
  fieldsList.forEach((field) => {
    let options: any[] = lookupMapper(
      field?.dataTypeMetadata?.lookupOptions ?? []
    );
    if (
      field.dataType === "stringArray" ||
      field.dataType === "stringLookup" ||
      field.dataType === "lookup"
    ) {
      const findDefaultOptionIndex = options.findIndex(
        (option) => option?.defaultOption && option?.visible
      );
      if (findDefaultOptionIndex !== -1)
        defaultDropdowns[field.name] = options[findDefaultOptionIndex]?.value;
    }
    if (field.dataType === "multiSelectLookup") {
      const defaultOptions = [
        ...options
          .map((option) =>
            option?.defaultOption && option?.visible ? option.value : null
          )
          ?.filter((option) => option),
      ];
      if (defaultOptions?.length > 0)
        defaultDropdowns[field.name] = [...defaultOptions];
    }
  });
  return { ...defaultDropdowns };
};

export const handleGenericFormSaveResponse = async ({
  type,
  appName,
  modelName,
  responseOnCompletion,
  subFormDetails,
  navigations,
  router,
  triggerSaveNext,
  subFormDataForId,
  setIdData,
  setSubFormDataForId,
  addModuleData,
  saveSubForm,
  setSubFormClear,
  setSaveNext,
  setSavingProcess,
}: GenericFormSaveResponseProps) => {
  if (
    responseOnCompletion?.data.save.data &&
    responseOnCompletion?.data.save.data.id &&
    responseOnCompletion?.data.save.messageKey.includes("-success")
  ) {
    sessionStorage.removeItem("sparkletec-customSerialNo");
    if (type === "add") {
      addModuleData(responseOnCompletion?.data.save.data, modelName);
    }
    let unexpectedError = false;
    if (subFormDetails?.modelName) {
      const handlePromises = async () => {
        if (type === "edit") {
          let subFormDataRemoved: any[] = [];
          subFormDataForId?.forEach((quoteSubForm) => {
            let findIndexInUpdatedData = range(
              0,
              subFormDetails?.totalSubForms
            )?.findIndex(
              (num: number) =>
                quoteSubForm?.id === subFormDetails?.values[`idSubForm${num}`]
            );
            if (findIndexInUpdatedData === -1)
              subFormDataRemoved.push(quoteSubForm);
          });

          const fetchPromiseForRemovingQuoteId = subFormDataRemoved?.map(
            async (quoteSubForm: any) => {
              const response = await saveSubForm({
                variables: {
                  id: quoteSubForm.id,
                  modelName: subFormDetails?.modelName,
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              });
              return response.data?.save;
            }
          );

          await Promise.all(fetchPromiseForRemovingQuoteId).then(
            (results: any[]) => {
              results.forEach((result) => {
                if (!result?.messageKey?.includes("-success")) {
                  unexpectedError = true;
                }
              });
            }
          );
        }

        const fetchPromise = range(0, subFormDetails?.totalSubForms);

        for (const num of fetchPromise) {
          let subFormValues: FormikValues = {
            ...getSubFormValue(num, subFormDetails),
          };

          if (checkIfAnyValueIsTouchedInSubForm(num, subFormDetails)) {
            const response = await saveSubForm({
              variables: {
                id:
                  type === "add"
                    ? null
                    : subFormDetails?.values?.[`idSubForm${num}`] || null,
                modelName: subFormDetails?.modelName,
                saveInput: {
                  ...subFormValues,
                  [subFormDetails?.modelName === "quotedItem"
                    ? "quoteId"
                    : subFormDetails?.modelName === "invoicedItem"
                    ? "invoiceId"
                    : subFormDetails?.modelName === "orderedItem"
                    ? "salesOrderId"
                    : subFormDetails?.modelName === "purchaseItem"
                    ? "purchaseId"
                    : ""]: responseOnCompletion?.data.save.data.id,
                },
              },
            });

            if (response.data?.save) {
              if (!response.data.save.messageKey?.includes("-success")) {
                unexpectedError = true;
              }
            }
          }
        }
      };
      await handlePromises();
    }
    if (!unexpectedError) {
      Toast.success(
        `${startCase(
          toLower(
            navigations.filter(
              (navigation) =>
                navigation.navTypeMetadata?.moduleName &&
                camelCase(navigation.navTypeMetadata?.moduleName) === modelName
            )[0]?.label.en
          )
        )} ${
          type === "add" ? "created" : type === "edit" ? "updated" : ""
        } successfully`
      );
    } else {
      Toast.error(t("common:unknown-message"));
    }
    if (triggerSaveNext) {
      setSubFormClear(false);
      setIdData({});
      setSubFormDataForId([]);
    }
    triggerSaveNext && setSavingProcess(false);
    !triggerSaveNext &&
      router?.replace(
        appsUrlGenerator(
          appName,
          modelName,
          AllowedViews.detail,
          responseOnCompletion?.data.save.data.id
        )
      );
    return;
  }
  setSavingProcess(false);
  setSaveNext(false);
  setSubFormClear(false);
  if (responseOnCompletion?.data.save.messageKey) {
    Toast.error(`${responseOnCompletion?.data.save.message}`);
    setSaveNext(false);
    setSubFormClear(false);
    return;
  }
  Toast.error(t("common:unknown-message"));
};

export const handleFetchQuoteSubformFields = async ({
  id,
  appName,
  quoteSubForm,
  allLayoutFetched,
  savingProcess,
  genericModels,
  getSubFormDataForId,
  subFormField,
  setSubFormDataIdLoading,
  setBackgroundProcessRunning,
}: handleFetchQuoteSubformFieldsProps) => {
  if (
    quoteSubForm &&
    id?.length &&
    !savingProcess &&
    allLayoutFetched &&
    appName
  ) {
    if (genericModels[quoteSubForm]?.fieldsList?.length > 0) {
      updateBackgroundProcessingInSession("GetSubFormDataById", true);
      if (quoteSubForm) {
        setSubFormDataIdLoading(true);
        getSubFormDataForId({
          variables: {
            modelName: quoteSubForm,
            fields: [
              ...getSortedFieldList(
                genericModels[quoteSubForm]?.fieldsList
              )?.map((field) =>
                field.systemDefined ? field.name : `fields.${field.name}`
              ),
            ],
            filters: [
              {
                operator: "eq",
                name: subFormField,
                value: id?.toString() || "",
              },
            ],
            orderBy: [{ name: "updatedAt", order: ["ASC"] }],
          },
        });
      } else {
        updateBackgroundProcessingInSession("GetSubFormDataById", false);
      }
      setSubFormDataIdLoading(false);
      setTimeout(() => setBackgroundProcessRunning(false), 10000);
    }
  }
};

export const checkIfAnyValueIsTouchedInSubForm = (
  num: number,
  subFormDetails?: {
    modelName: string;
    fieldsList: ICustomField[];
    totalSubForms: number;
    summarySections?: {
      aggregation_method: string;
      expression: string;
      fieldsUsed: [string];
      displayAs: { en: string };
      name: string;
      module_name: string;
      value: string | number | null | undefined;
    }[];
    values: FormikValues;
  }
) => {
  let anyFieldTouched = false;
  subFormDetails?.fieldsList
    ?.filter(
      (field) =>
        !["layoutId", "recordStatus"].includes(field.name) && field.addInForm
    )
    ?.forEach((field) => {
      if (
        subFormDetails?.values[`${field.name}SubForm${num}`] &&
        field.name !== "taxes"
      )
        anyFieldTouched = true;
    });
  return anyFieldTouched;
};

export const checkIfAllMandatoryValuesInSubFormAreFilled = (
  num: number,
  subFormDetails?: {
    modelName: string;
    fieldsList: ICustomField[];
    totalSubForms: number;
    summarySections?: {
      aggregation_method: string;
      expression: string;
      fieldsUsed: [string];
      displayAs: { en: string };
      name: string;
      module_name: string;
      value: string | number | null | undefined;
    }[];
    values: FormikValues;
  }
) => {
  let allMandatoryFieldsAreFilled = true;
  subFormDetails?.fieldsList
    ?.filter(
      (field) =>
        !["layoutId", "recordStatus"].includes(field.name) && field.addInForm
    )
    ?.forEach((field) => {
      if (
        field.mandatory &&
        field.name !== "quoteId" &&
        field.mandatory &&
        field.name !== "invoiceId" &&
        field.mandatory &&
        field.name !== "salesOrderId" &&
        field.mandatory &&
        field.name !== "purchaseId"
      ) {
        if (!subFormDetails?.values[`${field.name}SubForm${num}`])
          allMandatoryFieldsAreFilled = false;
      }
    });
  return allMandatoryFieldsAreFilled;
};

export const getSubFormValue = (
  num: number,
  subFormDetails?: {
    modelName: string;
    fieldsList: ICustomField[];
    totalSubForms: number;
    summarySections?: {
      aggregation_method: string;
      expression: string;
      fieldsUsed: [string];
      displayAs: { en: string };
      name: string;
      module_name: string;
      value: string | number | null | undefined;
    }[];
    values: FormikValues;
  }
) => {
  let subFormValues: FormikValues = {
    fields: {},
  };
  subFormDetails?.fieldsList
    ?.filter(
      (field) =>
        !["layoutId", "recordStatus"].includes(field.name) && field.addInForm
    )
    ?.forEach(
      (field) =>
        (subFormValues = !field.systemDefined
          ? {
              ...subFormValues,
              fields: {
                ...subFormValues.fields,
                [`${field?.name}`]:
                  subFormDetails?.values[`${field.name}SubForm${num}`],
              },
            }
          : {
              ...subFormValues,
              [field?.name]:
                subFormDetails?.values[`${field.name}SubForm${num}`],
            })
    );
  return { ...subFormValues };
};

export const checkFieldsListContainRelatedTo = (fieldsList: ICustomField[]) => {
  for (let i = 0; i < fieldsList.length; i++) {
    if (
      fieldsList[i].dataType === "relatedTo" &&
      fieldsList[i].systemDefined === true &&
      fieldsList[i].visible === true &&
      fieldsList[i].readOnly === false
    ) {
      return true;
    }
  }
  return false;
};
