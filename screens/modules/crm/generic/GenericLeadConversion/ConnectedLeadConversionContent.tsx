import React from "react";
import { useCrmFetchLazyQuery } from "../../shared/utils/operations";
import { BaseGenericObjectType } from "../../../../../models/shared";
import { LeadConversionContentContainer } from "./LeadConversionContentContainer";
import { conversionFilterHelper } from "./utils/leadConversionHelper";
import { GenericSkeletonList } from "../../../../../components/TailwindControls/ContentLoader/List/GenericSkeletonList";
import {
  commonContactOrganizationFetchField,
  contactOrganizationRequestHandler,
} from "./utils/connectedLeadConversionContentHelper";
import {
  IConnectedLeadConversionContent,
  IRelatedLeadModuleVariables,
} from "./utils/genericLeadConversionInterfaces";

export const ConnectedLeadConversionContent = ({
  fetchLayoutLoading,
  convertLeadData,
  tableFieldsList,
  leadContactOrganizationState,
  setLeadContactOrganizationState,
  leadFieldsList,
  contactFieldList,
  organizationFieldList,
  dealFieldList,
  mappedFieldsList,
  masterMappedFieldsList,
  setContactFieldList,
  setOrganizationFieldList,
  setDealFieldList,
  companyAvailable,
  navContactName,
  navOrganizationName,
  navDealName,
  navLeadName,
  setConversionProcessing,
  appName,
  modelName,
  id,
  stagesLookupOptions,
  layoutIds,
  userPreferences,
  setResponseData,
  resetValues,
  removeModuleDataById,
}: IConnectedLeadConversionContent) => {
  const [contactVariable, setContactVariable] =
    React.useState<IRelatedLeadModuleVariables | null>(null);
  const [organizationVariable, setOrganizationVariable] =
    React.useState<IRelatedLeadModuleVariables | null>(null);
  const [
    contactOrganizationFieldsFiltered,
    setContactOrganizationFieldsFiltered,
  ] = React.useState(false);

  const [fetchContactData] = useCrmFetchLazyQuery<BaseGenericObjectType>({
    fetchPolicy: "no-cache",
  });
  const [fetchOrganizationData] = useCrmFetchLazyQuery<BaseGenericObjectType>({
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    if (
      !fetchLayoutLoading &&
      (convertLeadData.company || convertLeadData.contactName)
    ) {
      const requestArray: string[] = [];
      const dataReqVar: Record<string, IRelatedLeadModuleVariables> = {};
      const fields = ["firstName", "email", "ownerId", "phoneNumber"];
      const contactFields = [...commonContactOrganizationFetchField],
        organizationFields = [...commonContactOrganizationFetchField];
      for (const fieldName of fields) {
        if (
          tableFieldsList.contact.filter(
            (f: { name: string }) => f.name === fieldName
          )?.[0]
        ) {
          contactFields.push(fieldName);
        }
        if (
          tableFieldsList.organization.filter(
            (f: { name: string }) => f.name === fieldName
          )?.[0]
        ) {
          organizationFields.push(fieldName);
        }
      }
      if (convertLeadData.company) {
        requestArray.push(`organization/${convertLeadData.company}`);
      }
      if (convertLeadData.phoneNumber) {
        requestArray.push(
          `contact/${
            convertLeadData.phoneNumber ? convertLeadData.phoneNumber : ""
          }${convertLeadData.email ? `/${convertLeadData.email}` : ""}`
        );
      } else {
        requestArray.push(
          `contact/${"null"}${
            convertLeadData.email ? `/${convertLeadData.email}` : ""
          }`
        );
      }
      requestArray.forEach(async (value) => {
        const valuesDataArray = value.split("/");
        const filters = [];
        let continueProcessing = true;
        if (valuesDataArray[0] == "contact") {
          if (valuesDataArray[1] === "null" && valuesDataArray.length === 2) {
            setResponseData({
              name: "contact",
              data: {
                ...leadContactOrganizationState["contact"],
                available: false,
                createNew: true,
                checked: true,
                processed: true,
              },
            });
            continueProcessing = false;
          } else if (valuesDataArray[1] !== "null") {
            filters.push({
              name: "phoneNumber",
              operator: "ieq",
              value: [`${valuesDataArray[1]}`],
            });
          }
          if (valuesDataArray.length === 3) {
            filters.push({
              name: "email",
              operator: "ieq",
              value: [`${valuesDataArray[2]}`],
            });
          }
        }
        if (valuesDataArray[0] == "organization") {
          filters.push({
            name: "name",
            operator: "ieq",
            value: [`${valuesDataArray[1]}`],
          });
        }
        if (!continueProcessing) return;
        if (filters?.length) {
          const variables =
            filters.length > 1
              ? {
                  variables: {
                    modelName: valuesDataArray[0],
                    fields:
                      valuesDataArray[0] === "contact"
                        ? contactFields
                        : organizationFields,
                    filters: filters,
                    expression: "( ( a ) or b ) ",
                  },
                }
              : {
                  variables: {
                    modelName: valuesDataArray[0],
                    fields:
                      valuesDataArray[0] === "contact"
                        ? contactFields
                        : organizationFields,
                    filters: filters,
                  },
                };
          dataReqVar[valuesDataArray[0]] = {
            ...variables,
          };
        }
      });
      for (const key in dataReqVar) {
        if (key === "contact") {
          setContactVariable(dataReqVar[key]);
        }
        if (key === "organization") {
          setOrganizationVariable(dataReqVar[key]);
        }
        contactOrganizationRequestHandler(
          dataReqVar[key],
          1,
          fetchContactData,
          fetchOrganizationData,
          setResponseData,
          leadContactOrganizationState
        );
      }
    }
  }, [convertLeadData, fetchLayoutLoading]);

  React.useEffect(() => {
    if (
      !fetchLayoutLoading &&
      leadFieldsList?.length &&
      contactFieldList?.length &&
      organizationFieldList?.length &&
      dealFieldList?.length &&
      mappedFieldsList["contact"]?.length &&
      !contactOrganizationFieldsFiltered
    ) {
      setContactFieldList(
        conversionFilterHelper(
          contactFieldList,
          mappedFieldsList["contact"],
          convertLeadData,
          masterMappedFieldsList,
          leadFieldsList,
          "contact"
        )
      );
      setOrganizationFieldList(
        conversionFilterHelper(
          organizationFieldList,
          mappedFieldsList["organization"],
          convertLeadData,
          masterMappedFieldsList,
          leadFieldsList,
          "organization"
        )
      );
      setDealFieldList(
        conversionFilterHelper(
          dealFieldList,
          mappedFieldsList["deal"],
          convertLeadData,
          masterMappedFieldsList,
          leadFieldsList,
          "deal"
        )
      );
      setContactOrganizationFieldsFiltered(true);
    }
  }, [mappedFieldsList, fetchLayoutLoading]);

  return convertLeadData?.id &&
    dealFieldList.length &&
    contactOrganizationFieldsFiltered &&
    leadContactOrganizationState.contact.processed &&
    (companyAvailable === false ||
      leadContactOrganizationState.organization.processed) ? (
    <LeadConversionContentContainer
      navContactName={navContactName}
      navOrganizationName={navOrganizationName}
      navDealName={navDealName}
      navLeadName={navLeadName}
      setConversionProcessing={setConversionProcessing}
      appName={appName}
      modelName={modelName}
      id={id}
      companyAvailable={companyAvailable}
      leadContactOrganizationState={leadContactOrganizationState}
      convertLeadData={convertLeadData}
      setLeadContactOrganizationState={setLeadContactOrganizationState}
      contactVariable={contactVariable}
      organizationVariable={organizationVariable}
      resetValues={resetValues}
      dealFieldList={dealFieldList}
      contactFieldList={contactFieldList}
      organizationFieldList={organizationFieldList}
      stagesLookupOptions={stagesLookupOptions}
      setDealFieldList={setDealFieldList}
      tableFieldsList={tableFieldsList}
      layoutIds={layoutIds}
      userPreferences={userPreferences}
      fetchContactData={fetchContactData}
      fetchOrganizationData={fetchOrganizationData}
      setResponseData={setResponseData}
      removeModuleDataById={removeModuleDataById}
    />
  ) : (
    <GenericSkeletonList itemCount={4} />
  );
};
