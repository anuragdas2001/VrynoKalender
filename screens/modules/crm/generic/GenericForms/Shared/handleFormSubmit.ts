import { range } from "lodash";
import {
  checkIfAllMandatoryValuesInSubFormAreFilled,
  checkIfAnyValueIsTouchedInSubForm,
} from "./genericFormSharedFunctions";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import {
  handleGenericFormSave,
  handleGenericFormSaveForCustomFields,
} from "../../../shared/utils/handleGenericFormSave";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import router from "next/router";
import { handleFormSubmitHandlerProps } from "./genericFormProps";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../../shared/utils/modelNameMapperForParamUrlGenerator";

export const handleFormSubmitHandler = async ({
  user,
  appName,
  modelName,
  cloneId,
  currentLayout,
  quoteSubForm,
  values,
  triggerSaveNext,
  totalSubForms,
  subFormDict,
  subFormData,
  updatePipeline,
  subFormFieldsListDict,
  fieldList,
  handleSave,
  onSelectSaveNext,
  saveData,
  setSavingProcess,
  setFormResetted,
  setCloneId,
  resetForm,
  setIdData,
  setSubFormDataForId,
  setUpdatePipeline,
  setTotalSubForms,
  setSubFormClear,
}: handleFormSubmitHandlerProps) => {
  setSavingProcess(true);
  const subFormArray = Object.keys(subFormDict || {});
  let subFormFieldsData: Record<string, any> = {};
  let filteredValues: Record<string, any> = {};
  let allMandatoryFieldsAreFilled: boolean = true;
  let errorWhileSavingSubform: boolean = false;

  if (subFormArray?.length) {
    const customValuesData: Record<string, any> = {};
    for (const key in values) {
      if (key === "fields") {
        for (const customKey in values[key]) {
          if (!subFormArray.includes(customKey)) {
            customValuesData[customKey] = values[key][customKey];
          }
        }
      } else if (!subFormArray.includes(key)) {
        filteredValues[key] = values[key];
      } else if (values[key]) {
        if (!subFormFieldsData[key]) {
          subFormFieldsData[key] = {
            data: values[key],
            metaData: subFormDict[key],
          };
        } else {
          subFormFieldsData[key]["data"] = values[key];
          subFormFieldsData[key]["metaData"] = subFormDict[key];
        }
      }
    }
    if (Object.keys(customValuesData)?.length) {
      filteredValues["fields"] = customValuesData;
    }
  } else {
    filteredValues = { ...values };
  }

  range(0, totalSubForms)?.map((num: number) => {
    let ifAnyValueIsTouchedInSubForm: boolean =
      checkIfAnyValueIsTouchedInSubForm(num, {
        modelName: quoteSubForm,
        fieldsList: subFormData
          ? subFormData[quoteSubForm].fieldsList ?? []
          : [],
        totalSubForms: totalSubForms,
        summarySections: subFormData
          ? subFormData[quoteSubForm].summarySection
          : [],
        values: filteredValues,
      });
    allMandatoryFieldsAreFilled = checkIfAllMandatoryValuesInSubFormAreFilled(
      num,
      {
        modelName: quoteSubForm,
        fieldsList: subFormData
          ? subFormData[quoteSubForm].fieldsList ?? []
          : [],
        totalSubForms: totalSubForms,
        summarySections: subFormData
          ? subFormData[quoteSubForm].summarySection
          : [],
        values: filteredValues,
      }
    );
    if (ifAnyValueIsTouchedInSubForm && !allMandatoryFieldsAreFilled) {
      errorWhileSavingSubform = true;
    }
  });

  if (triggerSaveNext) {
    if (Object.keys(subFormFieldsListDict)?.length) setSubFormClear(true);
    if (appName && modelName && cloneId?.length)
      router?.replace(
        appsUrlGenerator(
          appName,
          modelName,
          AllowedViews.add,
          undefined,
          modelNameValuesWithSystemSubForm.includes(modelName)
            ? [
                `?subform=${
                  modelNameMapperForParamURLGenerator(modelName)?.subForm
                }&&dependingModule=product&&subformfield=${
                  modelNameMapperForParamURLGenerator(modelName)
                    ?.subFormFieldLinked
                }`,
              ]
            : []
        )
      );
    setCloneId("");
    setIdData && setIdData({});
    setSubFormDataForId && setSubFormDataForId([]);
    resetForm();
    setFormResetted(true);
    setUpdatePipeline(!updatePipeline);
    setTotalSubForms(1);
  }
  if (errorWhileSavingSubform) {
    Toast.error("Mandatory fields have empty value");
    setSavingProcess(false);
    return;
  }

  if (Object.keys(subFormFieldsData).length) {
    const results = [];

    for (const val of Object.keys(subFormFieldsData)) {
      const subFormFieldsList =
        subFormFieldsListDict[subFormFieldsData[val].metaData.fieldName];
      if (!subFormFieldsList) {
        results.push({
          fieldName: null,
          promiseResponse: null,
          metaData: null,
        });
        continue;
      }

      const promiseArrayResponse = [];

      for (const data of subFormFieldsData[val].data) {
        const subFormValue = {
          ...handleGenericFormSave(
            subFormFieldsList.fieldsList,
            data,
            user?.timezone
          ),
          fields: handleGenericFormSaveForCustomFields(
            subFormFieldsList.fieldsList,
            data,
            user?.timezone
          ),
        };

        const response = await saveData({
          variables: {
            id: cloneId ? null : data.id || null,
            modelName: subFormFieldsData[val].metaData.modelName,
            saveInput: {
              ...subFormValue,
              layoutId: currentLayout?.id,
            },
          },
        });
        promiseArrayResponse.push(response);
      }

      results.push({
        fieldName: val,
        promiseResponse: promiseArrayResponse,
        metaData: subFormFieldsData[val].metaData,
      });
    }

    let subFormError = false;

    for (const item of results) {
      if (
        item.fieldName === null ||
        item.promiseResponse === null ||
        item.metaData === null
      )
        continue;

      const recordIds: string[] = [];
      let errorCount = 0;

      item.promiseResponse.forEach((result) => {
        if (result?.data?.save?.data?.id) {
          recordIds.push(result.data.save.data.id);
        } else {
          errorCount += 1;
        }
      });

      if (errorCount) {
        subFormError = true;
        Toast.error(
          `Error while saving ${item.metaData.label}: ${errorCount} records`
        );
      } else {
        filteredValues[item.fieldName] = recordIds;
      }
    }

    if (subFormError) {
      setSavingProcess(false);
      return;
    }
  }

  let updatedValues: any = { ...filteredValues };
  if (updatedValues?.employees === "") {
    updatedValues = { ...updatedValues, employees: null };
  }
  if (updatedValues?.employees && updatedValues?.employees.length) {
    if (!updatedValues?.employees.match(/^-?\d*\.?\d+$/)) {
      Toast.error("Employee field invalid value");
      setSavingProcess(false);
      return;
    }
  }
  if (triggerSaveNext) {
    onSelectSaveNext();
  }

  handleSave(
    {
      ...handleGenericFormSave(fieldList, updatedValues, user?.timezone),
      fields: handleGenericFormSaveForCustomFields(
        fieldList,
        filteredValues,
        user?.timezone
      ),
    },
    triggerSaveNext,
    {
      modelName: quoteSubForm,
      fieldsList: subFormData ? subFormData[quoteSubForm].fieldsList ?? [] : [],
      totalSubForms: totalSubForms,
      summarySections: subFormData
        ? subFormData[quoteSubForm].summarySection
        : [],
      values: filteredValues,
    }
  );
  if (triggerSaveNext) {
    if (Object.keys(subFormFieldsListDict)?.length) setSubFormClear(true);
    if (appName && modelName && cloneId?.length)
      router?.replace(
        appsUrlGenerator(
          appName,
          modelName,
          AllowedViews.add,
          undefined,
          modelNameValuesWithSystemSubForm.includes(modelName)
            ? [
                `?subform=${
                  modelNameMapperForParamURLGenerator(modelName)?.subForm
                }&&dependingModule=product&&subformfield=${
                  modelNameMapperForParamURLGenerator(modelName)
                    ?.subFormFieldLinked
                }`,
              ]
            : []
        )
      );
    setCloneId("");
    setIdData && setIdData({});
    setSubFormDataForId && setSubFormDataForId([]);
    resetForm();
    setFormResetted(true);
    setUpdatePipeline(!updatePipeline);
    setTotalSubForms(1);
  }
};
