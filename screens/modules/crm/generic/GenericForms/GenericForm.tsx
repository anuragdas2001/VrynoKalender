import { toast } from "react-toastify";
import { Formik, FormikState, FormikValues } from "formik";
import React, { useContext, useState } from "react";
import { GenericFormFields } from "./GenericFormFields/GenericFormFields";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ICustomField } from "../../../../../models/ICustomField";
import { getCustomFieldData } from "../../shared/utils/getDataObject";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import getInitialValuesFromList from "../../shared/utils/getInitialValuesFromList";
import getValidationSchema from "../../shared/utils/validations/getValidationSchema";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { getCountryCodeFromPreference } from "../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import {
  ISubFormItemDataType,
  IUserPreference,
} from "../../../../../models/shared";
import { AccountModels } from "../../../../../models/Accounts";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { GenericFormProps, SubformDataType } from "./Shared/genericFormProps";
import { handleFormSubmitHandler } from "./Shared/handleFormSubmit";

let fieldInitialValues = {};

export const GenericForm = ({
  id,
  cloneId,
  data,
  appName,
  modelName,
  currentUser,
  saveLoading,
  quoteSubForm,
  quoteDependingModule,
  subFormDataForId,
  editMode = false,
  saveNext,
  fieldList,
  formDetails,
  currentModule,
  retainValueFields,
  currentLayout,
  subFormDict,
  subFormDataDict,
  subFormFieldsListDict,
  subFormClear,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
  setIdData,
  setSubFormDataDict,
  setSubFormDataForId,
  handleSave,
  onCancel,
  onSelectSaveNext,
  onHandleSaveNext,
  setSavingProcess,
  importUserPreferences,
  setSubFormClear,
  setCloneId = () => {},
}: GenericFormProps) => {
  const filteredFieldsList = fieldList?.filter(
    (field) =>
      !(
        field.dataType === "multiSelectRecordLookup" &&
        field.dataTypeMetadata?.isSubform
      )
  );
  fieldInitialValues = getInitialValuesFromList(fieldList);
  const [formResetted, setFormResetted] = useState<boolean>(false);
  const [updatePipeline, setUpdatePipeline] = useState(false);
  const [formCustomization, setFormCustomization] =
    React.useState<boolean>(false);
  const [dependingModuleFields, setDependingModuleFields] = React.useState<
    ICustomField[]
  >([]);
  const [dependencyModuleLoading, setDependencyModuleLoading] =
    React.useState<boolean>(true);
  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );
  const [fetchingPreferences, setFetchingPreferences] =
    React.useState<boolean>(true);
  const subFormRefs: any = React.useRef([]);
  const [subFormData, setSubFormData] = React.useState<SubformDataType>();
  const [subFormDataLoading, setSubFormDataLoading] =
    React.useState<boolean>(true);
  const [totalSubForms, setTotalSubForms] = React.useState<number>(1);
  const [subFormDataSet, setSubFormDataSet] = React.useState(
    cloneId ? false : !editMode
  );
  const [subFormValidationErrors, setSubFormValidationErrors] = React.useState<
    Record<string, boolean>
  >({});

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onError: (response) => {
      toast.error(response?.message);
    },
  });

  const [getUserPreferences] = useLazyQuery<
    FetchData<IUserPreference>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
        if (
          responseOnCompletion.fetch.data &&
          responseOnCompletion.fetch.data.length > 0
        ) {
          importUserPreferences(responseOnCompletion.fetch.data);
          setFetchingPreferences(false);
        }
      }
      setFetchingPreferences(false);
    },
    onError: (error) => {
      setFetchingPreferences(false);
    },
  });

  const handleFormSubmit = (
    values: FormikValues,
    resetForm: (
      nextState?: Partial<FormikState<FormikValues>> | undefined
    ) => void,
    triggerSaveNext: boolean
  ) => {
    handleFormSubmitHandler({
      user: currentUser,
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
    });
  };

  React.useEffect(() => {
    if (!subFormDataDict?.length) {
      setSubFormDataSet(true);
      return;
    }
    if (
      !subFormDataSet &&
      subFormDataDict?.length &&
      Object.keys(data || {})?.length
    ) {
      const updatedSubFormDataDict: {
        fieldsList: ICustomField[];
        visibleFieldsList: ICustomField[];
        fieldsMetaData: ISubFormItemDataType;
        data: any[];
        fieldNameToSearchWith: string;
      }[] = [];
      if (data?.with)
        subFormDataDict.forEach((item) => {
          let fieldData: any[] = [];
          for (const key in data?.with) {
            if (key === item.fieldNameToSearchWith) {
              fieldData = data.with[key]?.[0].data || [];
            }
          }
          updatedSubFormDataDict.push({
            ...item,
            data: fieldData,
          });
        });
      setSubFormDataDict(updatedSubFormDataDict);
      setSubFormDataSet(true);
    }
  }, []);

  React.useEffect(() => {
    const fetchSubFormDetails = async () => {
      if (
        quoteSubForm &&
        currentModule &&
        allModulesFetched &&
        allLayoutFetched
      ) {
        setSubFormDataLoading(true);
        const updatedSubFormData = { ...subFormData };
        let layoutFromStore =
          genericModels[quoteSubForm]?.layouts?.length > 0
            ? genericModels[quoteSubForm]?.layouts[0]
            : undefined;
        let fieldsListFromStore =
          genericModels[quoteSubForm]?.fieldsList?.length > 0
            ? genericModels[quoteSubForm]?.fieldsList
            : [];
        let moduleMetadataFromStore = genericModels[quoteSubForm]?.moduleInfo;
        let newSubFormData =
          updatedSubFormData && updatedSubFormData[quoteSubForm]
            ? { ...updatedSubFormData[quoteSubForm] }
            : {};
        newSubFormData = {
          ...newSubFormData,
          layout: layoutFromStore,
          fieldsList: getSortedFieldList(fieldsListFromStore),
        };
        newSubFormData = {
          ...newSubFormData,
          moduleMetadata: moduleMetadataFromStore,
        };

        const summarySectionIndex: number =
          currentModule?.reverseLookups?.findIndex(
            (reverseLookup) => reverseLookup?.moduleName === quoteSubForm
          ) ?? -1;
        if (summarySectionIndex !== -1) {
          newSubFormData = {
            ...newSubFormData,
            summarySection:
              currentModule?.reverseLookups[summarySectionIndex]
                ?.summarySection,
          };
        }
        setSubFormData({ ...subFormData, [quoteSubForm]: newSubFormData });
        setSubFormDataLoading(false);
      } else {
        setSubFormDataLoading(false);
      }
    };
    fetchSubFormDetails();
  }, [quoteSubForm, currentModule, allLayoutFetched, allModulesFetched]);

  React.useEffect(() => {
    const fetchDependingModuleFieldList = async () => {
      if (quoteDependingModule && allLayoutFetched) {
        setDependencyModuleLoading(true);
        let fieldsListFromStore =
          genericModels[quoteDependingModule]?.fieldsList;
        setDependingModuleFields(getSortedFieldList(fieldsListFromStore));
        setDependencyModuleLoading(false);
      } else {
        setDependencyModuleLoading(false);
      }
    };
    fetchDependingModuleFieldList();
  }, [quoteDependingModule, allLayoutFetched]);

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);

  React.useEffect(() => {
    getUserPreferences({
      variables: {
        modelName: AccountModels.Preference,
        fields: ["id", "serviceName", "defaultPreferences"],
        filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
      },
    });
  }, [modelName]);

  if (
    (subFormDataLoading && dependencyModuleLoading) ||
    !subFormDataSet ||
    fetchingPreferences
  ) {
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
  }

  return (
    <Formik
      initialValues={{ ...fieldInitialValues, ...data }}
      validationSchema={getValidationSchema(
        filteredFieldsList?.filter((field) => field.visible),
        modelName
      )}
      enableReinitialize
      onSubmit={async (values: FormikValues, { resetForm }) => {}}
    >
      {({ setFieldTouched, resetForm, values }) => (
        <GenericFormFields
          appName={appName}
          modelName={modelName}
          fieldList={filteredFieldsList}
          editMode={editMode}
          handleSave={async () => {
            let validation: any = [];
            filteredFieldsList
              ?.filter((field) => field.visible)
              .forEach((field) => {
                validation[0] = setFieldTouched(field.name, true, true);
              });
            await Promise.all(validation).then((response) => {
              if (Object.keys(response[0])?.length === 0) {
                handleFormSubmit(values, resetForm, false);
              }
            });
            onHandleSaveNext();
          }}
          handleSaveNext={async () => {
            let validation: any = [];
            filteredFieldsList
              ?.filter((field) => field.visible)
              .forEach((field) => {
                validation[0] = setFieldTouched(field.name, true, true);
              });
            await Promise.all(validation).then((response) => {
              if (Object.keys(response[0])?.length === 0) {
                handleFormSubmit(values, resetForm, true);
              }
            });
          }}
          currentUser={currentUser}
          data={data}
          subFormData={subFormData}
          subFormDataForId={subFormDataForId}
          totalSubForms={totalSubForms}
          setTotalSubForms={(value) => setTotalSubForms(value)}
          formResetted={formResetted}
          isSample={Boolean(data["isSample"])}
          saveLoading={saveLoading}
          saveNext={saveNext}
          formDetails={formDetails}
          customFieldsData={editMode ? getCustomFieldData(data) : {}}
          onCancel={onCancel}
          currentModule={currentModule}
          updatePipeline={updatePipeline}
          retainValueFields={retainValueFields}
          editData={data && Object.keys(data)?.length > 0 ? data : {}}
          formCustomization={formCustomization}
          countryCodeInUserPreference={countryCodeInUserPreference}
          dependingModuleFields={dependingModuleFields}
          setFormCustomization={(value) => setFormCustomization(value)}
          subFormDataDict={subFormDataDict}
          subFormRefs={subFormRefs}
          subFormFieldsListDict={subFormFieldsListDict}
          setSubFormDataDict={setSubFormDataDict}
          id={id}
          userPreferences={userPreferences}
          subFormClear={subFormClear}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          allModulesFetched={allModulesFetched}
          importUserPreferences={importUserPreferences}
          setSubFormValidationErrors={(value: Record<string, boolean>) =>
            setSubFormValidationErrors(value)
          }
          subFormValidationErrors={subFormValidationErrors}
        />
      )}
    </Formik>
  );
};
