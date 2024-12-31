import React from "react";
import { ICustomField } from "../../../../../models/ICustomField";
import { conversionLModuleFieldsExtractor } from "./utils/leadConversionHelper";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { ConnectedLeadConversionContent } from "./ConnectedLeadConversionContent";
import {
  IConnectedLeadConversion,
  ILeadContactOrganization,
  leadContactOrganizationInitialData,
} from "./utils/genericLeadConversionInterfaces";

export const ConnectedLeadConversion = ({
  convertLeadData,
  navContactName,
  navOrganizationName,
  navDealName,
  navLeadName,
  companyAvailable,
  mappedFieldsList,
  setConversionProcessing,
  appName,
  modelName,
  id,
  masterMappedFieldsList,
  genericModels,
  userPreferences,
  allLayoutFetched,
  removeModuleDataById,
}: IConnectedLeadConversion) => {
  const [contactFieldList, setContactFieldList] = React.useState<
    ICustomField[]
  >([]);
  const [organizationFieldList, setOrganizationFieldList] = React.useState<
    ICustomField[]
  >([]);
  const [tableFieldsList, setTableFieldsList] = React.useState<{
    contact: ICustomField[];
    organization: ICustomField[];
  }>({
    contact: [],
    organization: [],
  });
  const [dealFieldList, setDealFieldList] = React.useState<ICustomField[]>([]);
  const [stagesLookupOptions, setStagesLookupOptions] = React.useState<
    Record<string, string>[]
  >([]);
  const [leadFieldsList, setLeadFieldsList] = React.useState<ICustomField[]>(
    []
  );
  const [fetchLayoutLoading, setFetchLayoutLoading] = React.useState(true);
  const [layoutIds, setLayoutIds] = React.useState<{
    contact: string | null;
    organization: string | null;
    deal: string | null;
  }>({
    contact: "",
    organization: "",
    deal: "",
  });
  const [leadContactOrganizationState, setLeadContactOrganizationState] =
    React.useState<{
      contact: ILeadContactOrganization;
      organization: ILeadContactOrganization;
    }>({
      contact: leadContactOrganizationInitialData,
      organization: leadContactOrganizationInitialData,
    });
  const [resetValues, setResetValues] = React.useState({
    contact: leadContactOrganizationInitialData,
    organization: leadContactOrganizationInitialData,
  });
  const [responseData, setResponseData] = React.useState({
    name: "",
    data: {},
  });

  React.useEffect(() => {
    if (responseData.name.length) {
      setLeadContactOrganizationState({
        ...leadContactOrganizationState,
        [responseData.name]: responseData.data,
      });
      setResetValues({
        ...resetValues,
        [responseData.name]: responseData.data,
      });
    }
  }, [responseData]);

  React.useEffect(() => {
    if (allLayoutFetched) {
      const tableFieldsList: {
        contact: ICustomField[];
        organization: ICustomField[];
      } = { contact: [], organization: [] };
      let layoutIdObject: {
        contact: string | null;
        organization: string | null;
        deal: string | null;
      } = { contact: "", organization: "", deal: "" };
      ["contact", "organization", "deal", "lead"].forEach((module) => {
        let fieldsListFromStore = genericModels[module]?.fieldsList;
        let layoutFromStore =
          genericModels[module]?.layouts?.length > 0
            ? genericModels[module]?.layouts[0]
            : null;
        if (module === "deal") {
          const dealFields = fieldsListFromStore
            .filter((field) => {
              if (
                field.visible &&
                !field.readOnly &&
                !["contactId", "organizationId"].includes(field.name) &&
                field.dataType !== "relatedTo" &&
                ([
                  "currency",
                  "amount",
                  "name",
                  "dealPipelineId",
                  "dealStageId",
                  "ownerId",
                ].includes(field.name) ||
                  field.mandatory)
              ) {
                return true;
              }
            })
            .map((field) => {
              if (field.name === "ownerId") return field;
              return { ...field, name: `deal-${field.name}` };
            });
          const dealFieldsData = getSortedFieldList(dealFields);
          setDealFieldList(dealFieldsData);
          if (dealFieldsData.length) {
            for (let i = 0; i < dealFieldsData.length; i++) {
              const field = dealFieldsData[i];
              if (field.name === "deal-dealStageId" && field.systemDefined) {
                setStagesLookupOptions(field.dataTypeMetadata.lookupOptions);
                break;
              }
            }
          }
          layoutIdObject.deal = layoutFromStore?.id ?? null;
        } else if (layoutFromStore?.moduleName === "contact") {
          tableFieldsList.contact = fieldsListFromStore.filter(
            (field) =>
              field.visible &&
              ["firstName", "name", "email", "phoneNumber"].includes(field.name)
          );
          setContactFieldList(
            getSortedFieldList(
              conversionLModuleFieldsExtractor("contact", fieldsListFromStore)
            )
          );
          layoutIdObject.contact = layoutFromStore?.id;
        } else if (layoutFromStore?.moduleName === "organization") {
          tableFieldsList.organization = fieldsListFromStore.filter(
            (field) =>
              field.visible &&
              ["name", "email", "phoneNumber"].includes(field.name)
          );
          setOrganizationFieldList(
            getSortedFieldList(
              conversionLModuleFieldsExtractor(
                "organization",
                fieldsListFromStore
              )
            )
          );
          layoutIdObject.organization = layoutFromStore?.id;
        } else if (layoutFromStore?.moduleName === "lead") {
          setLeadFieldsList(fieldsListFromStore);
        }
      });
      setLayoutIds(layoutIdObject);
      setFetchLayoutLoading(false);
      setTableFieldsList(tableFieldsList);
    }
  }, [allLayoutFetched]);

  return (
    <ConnectedLeadConversionContent
      fetchLayoutLoading={fetchLayoutLoading}
      convertLeadData={convertLeadData}
      tableFieldsList={tableFieldsList}
      leadContactOrganizationState={leadContactOrganizationState}
      setLeadContactOrganizationState={(value: {
        contact: ILeadContactOrganization;
        organization: ILeadContactOrganization;
      }) => setLeadContactOrganizationState(value)}
      leadFieldsList={leadFieldsList}
      contactFieldList={contactFieldList}
      organizationFieldList={organizationFieldList}
      dealFieldList={dealFieldList}
      mappedFieldsList={mappedFieldsList}
      masterMappedFieldsList={masterMappedFieldsList}
      setContactFieldList={(value: ICustomField[]) =>
        setContactFieldList(value)
      }
      setOrganizationFieldList={(value: ICustomField[]) =>
        setOrganizationFieldList(value)
      }
      setDealFieldList={(value: ICustomField[]) => setDealFieldList(value)}
      companyAvailable={companyAvailable}
      navContactName={navContactName}
      navOrganizationName={navOrganizationName}
      navDealName={navDealName}
      navLeadName={navLeadName}
      setConversionProcessing={setConversionProcessing}
      appName={appName}
      modelName={modelName}
      id={id}
      stagesLookupOptions={stagesLookupOptions}
      layoutIds={layoutIds}
      setResponseData={(value: { name: string; data: {} }) =>
        setResponseData(value)
      }
      resetValues={resetValues}
      userPreferences={userPreferences}
      removeModuleDataById={removeModuleDataById}
    />
  );
};
