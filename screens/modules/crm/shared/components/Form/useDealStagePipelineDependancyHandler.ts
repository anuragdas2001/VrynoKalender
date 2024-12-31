import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { IDealPipelineStage } from "../../../../../../models/shared";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { getUpdatedFormFieldsListForDealStage } from "./getUpdatedFormFieldsListForDealStage";
import { FormikErrors, FormikValues } from "formik";

export const handleDependencyLookupFiltering = (
  parentField: string,
  parentLookup: string,
  childField: string,
  stopNullSet = false,
  lookupDependencyFields: Record<string, Record<string, any>>,
  formFieldsList: ICustomField[],
  setFormFieldsList: (values: ICustomField[]) => void,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Record<string, string>>>
) => {
  let stages =
    lookupDependencyFields[
      parentField
    ].parentMetadata.fieldDependencyMapping.filter(
      (stage: { parentRecordId: string }) =>
        stage.parentRecordId === parentLookup
    )[0]?.childRecordIds || [];

  const updatedFormFieldsList: ICustomField[] = [];
  const childLookups =
    lookupDependencyFields[parentField].childMetadata.lookupOptions;
  formFieldsList.forEach((field) => {
    if (field.name === childField) {
      if (stages.length === 0) {
        updatedFormFieldsList.push({
          ...field,
          dataTypeMetadata: {
            ...field.dataTypeMetadata,
            lookupOptions: childLookups,
          },
        });
      } else {
        const lookupOptions: any[] = [];
        for (let i = 0; i < stages.length; i++) {
          for (let j = 0; j < childLookups.length; j++) {
            if (stages[i] === childLookups[j].id) {
              lookupOptions.push(childLookups[j]);
              break;
            }
          }
        }

        let updatedField = {
          ...field,
          dataTypeMetadata: {
            ...field.dataTypeMetadata,
            lookupOptions: lookupOptions,
          },
        };
        updatedFormFieldsList.push(updatedField);
      }
    } else {
      updatedFormFieldsList.push(field);
    }
  });
  if (!stopNullSet) {
    setFieldValue(childField, null);
  }
  setFormFieldsList(
    updatedFormFieldsList?.filter(
      (field) =>
        field.visible &&
        field.addInForm &&
        (field.dataType === SupportedDataTypes.expression
          ? true
          : !field.readOnly)
    )
  );
};

export function useDealStagePipelineDependancyHandler(
  appName: string,
  moduleName: string,
  fieldList: ICustomField[],
  formFieldsList: ICustomField[],
  editMode: boolean,
  values: FormikValues,
  editData: Record<string, string | Record<string, Record<string, string>>>,
  customFieldsData: Record<string, Record<string, string>> | undefined,
  isDefaultStagePipelineResetted: boolean,
  setDefaultStageAndPipeline: boolean,
  dealPipelineStages: IDealPipelineStage[],
  lookupDependencyFields: Record<string, Record<string, any>>,
  updatePipeline: boolean,
  stagesLookupOptions: any[],
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Record<string, string>>>,
  setFormFieldsList: (values: ICustomField[]) => void,
  setIsDefaultStagePipelineResetted: (value: boolean) => void,
  setDealPipelineStages: (values: IDealPipelineStage[]) => void,
  setLookupDependencyFields: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, any>>>
  >,
  setStagesLookupOptions: React.Dispatch<React.SetStateAction<any[]>>
) {
  const [getDealPipeLineStages] = useLazyQuery<
    FetchData<IDealPipelineStage>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setDealPipelineStages(responseOnCompletion.fetch.data);
      }
    },
  });

  useEffect(() => {
    if (fieldList?.length && !formFieldsList.length) {
      let dependencyFields = {};
      fieldList.forEach((field) => {
        if (
          !["dealPipelineId", "dealStageId"].includes(field.name) &&
          field.parentFieldUniqueName
        ) {
          const dependentField = fieldList.filter(
            (fL) => field.parentFieldUniqueName == fL.uniqueName
          )?.[0];
          if (dependentField) {
            dependencyFields = {
              ...dependencyFields,
              [dependentField.name]: {
                parentLabel: dependentField.label.en,
                childLabel: field.label.en,
                chidField: field.name,
                parentMetadata: dependentField.dataTypeMetadata,
                childMetadata: field.dataTypeMetadata,
              },
            };
          }
        }
      });
      setLookupDependencyFields(dependencyFields);
      setFormFieldsList(
        fieldList?.filter(
          (field) =>
            field.visible &&
            field.addInForm &&
            (field.dataType === SupportedDataTypes.expression
              ? true
              : !field.readOnly)
        )
      );
    }
  }, [fieldList, formFieldsList]);

  useEffect(() => {
    if (
      editMode &&
      Object.keys(lookupDependencyFields).length &&
      editData &&
      Object.keys(editData).length
    ) {
      const dataObject =
        customFieldsData && Object.keys(customFieldsData).length
          ? {
              ...editData,
              ...(customFieldsData as Record<string, Record<string, string>>),
            }
          : editData;
      for (const key in lookupDependencyFields) {
        if (dataObject[key]) {
          handleDependencyLookupFiltering(
            key,
            dataObject[key] as any,
            lookupDependencyFields[key].chidField,
            true,
            lookupDependencyFields,
            formFieldsList,
            setFormFieldsList,
            setFieldValue
          );
        }
      }
    }
  }, [editMode, lookupDependencyFields, editData]);

  useEffect(() => {
    if (formFieldsList.length && dealPipelineStages.length) {
      let dealPipelineField: ICustomField | null = null,
        dealStageField: ICustomField | null = null;
      let count = 0;

      for (let i = 0; i < formFieldsList.length; i++) {
        const field = formFieldsList[i];
        if (field.name === "dealPipelineId" && field.systemDefined) {
          dealPipelineField = field;
          ++count;
        }
        if (field.name === "dealStageId" && field.systemDefined) {
          dealStageField = field;
          ++count;
        }
        if (count === 2) break;
      }
      const defaultDealPipeline = dealPipelineStages.filter(
        (stage) => stage.isDefault
      );
      if (defaultDealPipeline.length && !editMode) {
        if (dealPipelineField && defaultDealPipeline[0].id) {
          setFieldValue(dealPipelineField.name, defaultDealPipeline[0].id);
        }
        if (dealStageField && defaultDealPipeline[0].stages) {
          setFieldValue(dealStageField.name, defaultDealPipeline[0].stages[0]);
        }
      }
    }
  }, [dealPipelineStages, updatePipeline]);

  useEffect(() => {
    if (
      values["dealPipelineId"] &&
      formFieldsList.length &&
      stagesLookupOptions?.length
    ) {
      const dealPipelineField = formFieldsList.filter(
        (field) => field.name === "dealPipelineId" && field.systemDefined
      );

      let stages =
        dealPipelineField[0].dataTypeMetadata.fieldDependencyMapping.filter(
          (stage: { parentRecordId: string }) =>
            stage.parentRecordId === values["dealPipelineId"]
        )[0]?.childRecordIds || [];
      const sID =
        stages.length && values["dealStageId"]
          ? stages.filter((id: string) => id === values["dealStageId"])[0]
          : "";
      const stageId = sID?.length ? sID : stages.length ? stages[0] : "";
      const updatedFormFieldsList = getUpdatedFormFieldsListForDealStage(
        formFieldsList,
        stages,
        stagesLookupOptions
      );
      setFormFieldsList(
        updatedFormFieldsList?.filter(
          (field) =>
            field.visible &&
            field.addInForm &&
            (field.dataType === SupportedDataTypes.expression
              ? true
              : !field.readOnly)
        )
      );
      setFieldValue("dealStageId", stageId);
    }
  }, [values["dealPipelineId"], stagesLookupOptions]);

  useEffect(() => {
    if (
      !isDefaultStagePipelineResetted &&
      !setDefaultStageAndPipeline &&
      formFieldsList?.length &&
      !values["dealPipelineId"]
    ) {
      setFormFieldsList(
        formFieldsList?.map((field) => {
          if (field.name === "dealStageId") {
            return {
              ...field,
              dataTypeMetadata: {
                ...field?.dataTypeMetadata,
                lookupOptions: [],
              },
            };
          }
          return field;
        })
      );
      setIsDefaultStagePipelineResetted(true);
    }
  }, [formFieldsList]);

  useEffect(() => {
    if (moduleName === "deal" && fieldList.length) {
      for (let i = 0; i < fieldList.length; i++) {
        const field = fieldList[i];
        if (field.name === "dealStageId" && field.systemDefined) {
          setStagesLookupOptions(field.dataTypeMetadata.lookupOptions);
          break;
        }
      }
    }
  }, [moduleName, fieldList]);

  useEffect(() => {
    if (moduleName === "deal" && setDefaultStageAndPipeline && appName) {
      getDealPipeLineStages({
        variables: {
          modelName: "dealPipeline",
          fields: ["id", "name", "isDefault", "stages"],
          filters: [
            { name: "recordStatus", operator: "in", value: ["a", "i"] },
          ],
        },
      });
    }
  }, [moduleName, appName]);
}
