import { FormikValues } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { camelCase } from "change-case";
import React from "react";
import { GenericForm } from "./GenericForm";
import { useTranslation } from "next-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import PageNotFound from "../../shared/components/PageNotFound";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { SupportedMutationNames } from "../../../../../graphql/helpers/graphQLShared";
import { mutationNameGenerator } from "../../../../../graphql/helpers/mutationNameGenerator";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  checkForAnyBackgroundProcessRunning,
  updateBackgroundProcessingInSession,
} from "../../../shared";
import {
  GenericAddEditProps,
  SubFormDetailSaveType,
} from "./Shared/genericFormProps";
import {
  handleFetchQuoteSubformFields,
  handleGenericFormSaveResponse,
} from "./Shared/genericFormSharedFunctions";
import {
  fetchFormDataHelper,
  getFormVariables,
} from "./SubForm/fetchFormDataHelper";

export const GenericEdit = ({
  id,
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
  setSubFormDataDict,
  setSubFormClear,
  setBackgroundProcessRunning = () => {},
}: GenericAddEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const subFormField = camelCase(searchParams.get("subformfield") ?? "");
  const [idData, setIdData] = React.useState<any>({});
  const [idDataLoading, setIdDataLoading] = React.useState<boolean>(true);
  const [subFormDataForId, setSubFormDataForId] = React.useState<any[]>([]);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [subFormDataIdLoading, setSubFormDataIdLoading] =
    React.useState<boolean>(false);

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
    onError: (error) => {
      setSubFormDataIdLoading(false);
    },
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
      onError: (error) => {
        toast.error("Error while fetching module data");
      },
    }
  );

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
  });

  const handleFormSave = async (
    values: FormikValues,
    subFormDetails?: SubFormDetailSaveType
  ) => {
    setSavingProcess(true);
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
          id: id,
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
          type: "edit",
          appName,
          modelName,
          responseOnCompletion,
          subFormDetails,
          navigations,
          router,
          triggerSaveNext: false,
          subFormDataForId,
          setIdData,
          setSubFormDataForId,
          addModuleData,
          saveSubForm,
          setSubFormClear,
          setSaveNext: () => {},
          setSavingProcess,
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!appName || !id?.length || fieldsList?.length <= 0) return;
    updateBackgroundProcessingInSession("GetDataById", true);
    getDataById({
      variables: getFormVariables(id),
    });
  }, [appName, id, fieldsList]);

  React.useEffect(() => {
    handleFetchQuoteSubformFields({
      id: id ?? "",
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
  }, [quoteSubForm, id, allLayoutFetched, appName]);

  React.useEffect(() => {
    setBackgroundProcessRunning(checkForAnyBackgroundProcessRunning());
  }, [JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }")]);

  if (idDataLoading || subFormDataIdLoading || fieldsList?.length <= 0) {
    return (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  } else if (!idDataLoading && idData && Object.keys(idData).length) {
    return (
      <GenericForm
        data={{ ...idData }}
        appName={appName}
        modelName={modelName}
        currentUser={currentUser}
        quoteSubForm={quoteSubForm}
        quoteDependingModule={quoteDependingModule}
        subFormDataForId={subFormDataForId}
        saveLoading={savingProcess}
        fieldList={fieldsList}
        currentModule={currentModule}
        handleSave={(data, triggerSaveNext, subFormDetails) =>
          handleFormSave(data, subFormDetails)
        }
        formDetails={{ type: "edit", modelName: modelName, appName: appName }}
        editMode={true}
        onHandleSaveNext={() => {}}
        onSelectSaveNext={() => {}}
        onCancel={() => router.back()}
        currentLayout={currentLayout}
        subFormDict={subFormDict}
        subFormDataDict={subFormDataDict}
        setSubFormDataDict={setSubFormDataDict}
        subFormFieldsListDict={subFormFieldsListDict}
        setSavingProcess={(value) => setSavingProcess(value)}
        id={id}
        subFormClear={subFormClear}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        userPreferences={userPreferences}
        importUserPreferences={importUserPreferences}
        setSubFormClear={setSubFormClear}
      />
    );
  } else
    return (
      <PageNotFound
        message="Sorry we could not find the record that you were looking for !"
        show404={false}
      />
    );
};
