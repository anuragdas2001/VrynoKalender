import { FormikValues } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { camelCase } from "change-case";
import React from "react";
import { GenericForm } from "./GenericForm";
import { useTranslation } from "next-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  checkForAnyBackgroundProcessRunning,
  updateBackgroundProcessingInSession,
} from "../../../shared";
import {
  getDefaultDropdowns,
  handleFetchQuoteSubformFields,
  handleGenericFormSaveResponse,
} from "./Shared/genericFormSharedFunctions";
import {
  GenericAddEditProps,
  SubFormDetailSaveType,
} from "./Shared/genericFormProps";
import { mutationNameGenerator } from "../../../../../graphql/helpers/mutationNameGenerator";
import { SupportedMutationNames } from "../../../../../graphql/helpers/graphQLShared";
import {
  fetchFormDataHelper,
  getFormVariables,
} from "./SubForm/fetchFormDataHelper";

export const GenericAdd = ({
  appName,
  modelName,
  currentModule,
  currentUser,
  subFormDict,
  subFormDataDict,
  subFormFieldsListDict,
  subFormClear,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
  fieldsList,
  searchParams,
  currentLayout,
  navigations,
  quoteSubForm,
  quoteDependingModule,
  importUserPreferences,
  addModuleData,
  setSubFormClear,
  setSubFormDataDict,
  setBackgroundProcessRunning = () => {},
}: GenericAddEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const parentDependentField: string[] = [];
  const parentDependentFieldValue: string[] = [];
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [saveNext, setSaveNext] = React.useState(false);
  const [cloneId, setCloneId] = React.useState<string>(
    searchParams.get("cloneId") ?? ""
  );
  const [idData, setIdData] = React.useState<any>({});
  const [idDataLoading, setIdDataLoading] = React.useState<boolean>(true);
  const [subFormDataForId, setSubFormDataForId] = React.useState<any[]>([]);
  const [subFormDataIdLoading, setSubFormDataIdLoading] =
    React.useState<boolean>(false);
  const subFormField = camelCase(searchParams.get("subformfield") ?? "");

  searchParams.forEach((value, key) => {
    if (key === "parentDependentField") {
      parentDependentField.push(camelCase(value));
    } else if (key === "parentDependentFieldValue") {
      parentDependentFieldValue.push(value);
    }
  });

  const [getDataById] = useLazyQuery(
    fetchFormDataHelper({ fieldsList, modelName, subFormFieldsListDict }),
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (
          responseOnCompletion?.[
            `${mutationNameGenerator(SupportedMutationNames.fetch, modelName)}`
          ]?.data
        ) {
          setIdData(
            responseOnCompletion[
              `${mutationNameGenerator(
                SupportedMutationNames.fetch,
                modelName
              )}`
            ].data[0]
          );
        }
        setIdDataLoading(false);
        updateBackgroundProcessingInSession("GetDataById", false);
      },
    }
  );

  const [getSubFormDataForId] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setSubFormDataForId(responseOnCompletion?.fetch?.data);
      }
      setSubFormDataIdLoading(false);
      updateBackgroundProcessingInSession("GetSubFormDataById", false);
    },
  });

  const [saveSubForm] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onError: (response) => {
      toast.error(response?.message);
      setSavingProcess(false);
      setSaveNext(false);
      setSubFormClear(false);
    },
  });

  const handleFormSave = async (
    values: FormikValues,
    triggerSaveNext: boolean,
    subFormDetails?: SubFormDetailSaveType
  ) => {
    try {
      let formValues: FormikValues = {};
      subFormDetails?.summarySections?.forEach(
        (field) =>
          (formValues = {
            ...formValues,
            [field?.name.replace("Summary", "")]:
              subFormDetails?.values[`${field.name}SummarySection`],
          })
      );
      await saveData({
        variables: {
          id: null,
          modelName: modelName,
          saveInput: {
            ...values,
            ...formValues,
            layoutId: currentLayout?.id,
          },
        },
      }).then(async (responseOnCompletion) => {
        handleGenericFormSaveResponse({
          t,
          type: "add",
          appName,
          modelName,
          responseOnCompletion,
          subFormDetails,
          navigations,
          router,
          triggerSaveNext,
          setIdData,
          setSubFormDataForId,
          addModuleData,
          saveSubForm,
          setSubFormClear,
          setSaveNext,
          setSavingProcess,
        });
      });
    } catch (error) {
      console.error(error);
      setSubFormClear(false);
    }
  };

  React.useEffect(() => {
    handleFetchQuoteSubformFields({
      id: cloneId,
      appName,
      quoteSubForm,
      allLayoutFetched,
      savingProcess,
      genericModels,
      getSubFormDataForId,
      subFormField,
      setSubFormDataIdLoading,
      setBackgroundProcessRunning,
    });
  }, [quoteSubForm, cloneId, allLayoutFetched, appName]);

  React.useEffect(() => {
    if (!appName || fieldsList?.length <= 0) return;
    setTimeout(() => setBackgroundProcessRunning(false), 10000);
    if (cloneId?.length) {
      updateBackgroundProcessingInSession("GetDataById", true);
      getDataById({
        variables: getFormVariables(cloneId),
      });
    } else {
      setIdDataLoading(false);
      setSubFormDataIdLoading(false);
    }
  }, [appName, cloneId, fieldsList]);

  React.useEffect(() => {
    setBackgroundProcessRunning(checkForAnyBackgroundProcessRunning());
  }, [JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }")]);

  if (idDataLoading || subFormDataIdLoading || fieldsList?.length <= 0)
    return (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col  items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  else {
    let data = {};
    const dependentData: Record<string, string> = {};
    for (let index = 0; index < parentDependentField.length; index++) {
      dependentData[parentDependentField[index]] =
        parentDependentFieldValue[index];
    }
    if (cloneId?.length) {
      data = { ...idData, ...dependentData };
    } else if (saveNext || !cloneId?.length) {
      data = { ...getDefaultDropdowns(fieldsList), ...dependentData };
    } else
      data = {
        ...getDefaultDropdowns(fieldsList),
        ...idData,
        ...dependentData,
      };

    return (
      <GenericForm
        id={undefined}
        data={data}
        subFormDataForId={subFormDataForId}
        quoteSubForm={quoteSubForm}
        quoteDependingModule={quoteDependingModule}
        retainValueFields={parentDependentField}
        appName={appName}
        modelName={modelName}
        currentUser={currentUser}
        saveLoading={savingProcess}
        currentModule={currentModule}
        fieldList={fieldsList}
        handleSave={(data, triggerSaveNext, subFormDetails) =>
          handleFormSave(data, triggerSaveNext, subFormDetails)
        }
        formDetails={{ type: "add", modelName: modelName, appName: appName }}
        saveNext={saveNext}
        setCloneId={setCloneId}
        onHandleSaveNext={() => {
          setSaveNext(false);
        }}
        onSelectSaveNext={() => {
          setSaveNext(true);
          setSubFormDataForId([]);
        }}
        onCancel={() =>
          router
            .push(appsUrlGenerator(appName, modelName, AllowedViews.view))
            .then()
        }
        editMode={cloneId?.length ? true : false}
        cloneId={cloneId}
        setSubFormDataForId={(value: any[]) => setSubFormDataForId(value)}
        setIdData={(value: any) => setIdData(value)}
        currentLayout={currentLayout}
        subFormDict={subFormDict}
        subFormDataDict={subFormDataDict}
        setSubFormDataDict={setSubFormDataDict}
        subFormFieldsListDict={subFormFieldsListDict}
        setSavingProcess={(value) => setSavingProcess(value)}
        subFormClear={subFormClear}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        userPreferences={userPreferences}
        importUserPreferences={importUserPreferences}
        setSubFormClear={setSubFormClear}
      />
    );
  }
};
