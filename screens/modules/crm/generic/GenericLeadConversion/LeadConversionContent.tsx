import React from "react";
import { useLazyQuery } from "@apollo/client";
import { Formik, FormikValues } from "formik";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../models/shared";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import getInitialValuesFromList from "../../shared/utils/getInitialValuesFromList";
import getValidationSchema from "../../shared/utils/validations/getValidationSchema";
import { LeadConversionConvertHeader } from "./LeadConversionComponent/LeadConversionConvertHeader";
import { LeadConversionMappingContainer } from "./LeadConversionComponent/LeadConversionMappingContainer";
import {
  IConvertLeadData,
  ILeadContactOrganization,
} from "./utils/genericLeadConversionInterfaces";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";

export const LeadConversionContent = ({
  navContactName,
  navOrganizationName,
  navDealName,
  navLeadName,
  dealFieldList,
  contactFieldList,
  organizationFieldList,
  stagesLookupOptions,
  setDealFieldList,
  companyAvailable,
  appName,
  modelName,
  resetValues,
  handleResetValues,
  leadContactOrganizationState,
  leadDeal,
  handleFormSave,
  convertLeadData,
  handleCheckboxSelect,
  convertRecordItemSelect,
  handlePageChange,
  tableFieldsList,
  userPreferences,
}: {
  navContactName: string;
  navOrganizationName: string;
  navDealName: string;
  navLeadName: string;
  dealFieldList: ICustomField[];
  contactFieldList: ICustomField[];
  organizationFieldList: ICustomField[];
  stagesLookupOptions: Record<string, string>[];
  setDealFieldList: (value: ICustomField[]) => void;
  companyAvailable: boolean | null;
  appName: string;
  modelName: string;
  resetValues: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  handleResetValues: () => void;
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  leadDeal: {
    checked: boolean;
  };
  userPreferences: IUserPreference[];
  handleFormSave: (values: FormikValues) => void;
  convertLeadData: IConvertLeadData;
  handleCheckboxSelect: (
    module: string,
    createNew: boolean,
    showTable: boolean
  ) => void;
  convertRecordItemSelect: (
    module: "contact" | "organization",
    record: BaseGenericObjectType,
    bypassData?: boolean
  ) => void;
  handlePageChange: (moduleName: string, pageNumber: number) => void;
  tableFieldsList: {
    contact: ICustomField[];
    organization: ICustomField[];
  };
}) => {
  const [activePipeline, setActivePipeline] =
    React.useState<IModuleMetadata | null>(null);

  const [formReset, setFormReset] = React.useState(false);

  const [getPipelineData] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data?.length) {
          setActivePipeline(
            responseOnCompletion?.fetch?.data.filter((val) => val.isDefault)[0]
          );
        }
      },
    }
  );

  React.useEffect(() => {
    if (!appName) return;
    getPipelineData({
      variables: {
        modelName: "DealPipeline",
        fields: ["name", "instanceId", "stages", "isDefault"],
        filters: [],
      },
    });
  }, [appName]);

  React.useEffect(() => {
    if (!formReset) {
      setFormReset(true);
    }
  }, [formReset]);

  return (
    <Formik
      initialValues={
        companyAvailable
          ? {
              ...getInitialValuesFromList(dealFieldList),
              ...getInitialValuesFromList(contactFieldList),
              ...getInitialValuesFromList(organizationFieldList),
            }
          : {
              ...getInitialValuesFromList(dealFieldList),
              ...getInitialValuesFromList(contactFieldList),
            }
      }
      onSubmit={(values) => {}}
      validationSchema={
        companyAvailable
          ? getValidationSchema([
              ...dealFieldList,
              ...contactFieldList,
              ...organizationFieldList,
            ])
          : getValidationSchema([...dealFieldList, ...contactFieldList])
      }
    >
      {() => (
        <>
          <LeadConversionConvertHeader
            navLeadName={navLeadName}
            appName={appName}
            modelName={modelName}
            activePipeline={activePipeline}
            resetValues={resetValues}
            handleResetValues={handleResetValues}
            formReset={formReset}
            setFormReset={setFormReset}
            leadContactOrganizationState={leadContactOrganizationState}
            contactFieldList={contactFieldList}
            dealFieldList={dealFieldList}
            companyAvailable={companyAvailable}
            organizationFieldList={organizationFieldList}
            leadDeal={leadDeal}
            handleFormSave={handleFormSave}
          />
          <LeadConversionMappingContainer
            convertLeadData={convertLeadData}
            handleCheckboxSelect={handleCheckboxSelect}
            leadDeal={leadDeal}
            activePipeline={activePipeline}
            navContactName={navContactName}
            navOrganizationName={navOrganizationName}
            navDealName={navDealName}
            navLeadName={navLeadName}
            contactFieldList={contactFieldList}
            organizationFieldList={organizationFieldList}
            dealFieldList={dealFieldList}
            stagesLookupOptions={stagesLookupOptions}
            convertRecordItemSelect={convertRecordItemSelect}
            companyAvailable={companyAvailable}
            onPageChange={handlePageChange}
            leadContactOrganizationState={leadContactOrganizationState}
            setDealFieldList={setDealFieldList}
            tableFieldsList={tableFieldsList}
            userPreferences={userPreferences}
          />
        </>
      )}
    </Formik>
  );
};
