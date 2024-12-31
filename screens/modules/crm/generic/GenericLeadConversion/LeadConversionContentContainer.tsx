import { FormikValues } from "formik";
import React from "react";
import { useTranslation } from "next-i18next";
import { useMutation } from "@apollo/client";
import { EXECUTE_CONVERSION } from "../../../../../graphql/mutations/executeConversion";
import { toast } from "react-toastify";
import router from "next/router";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import {
  handleItemSelect,
  handleLeadConvertDataTransformation,
  leadConvertSaveDataHelper,
} from "./utils/leadConversionHelper";
import { LeadConversionContent } from "./LeadConversionContent";
import {
  ILeadConversionContentContainer,
  IMutationGeneratorResult,
} from "./utils/genericLeadConversionInterfaces";
import { BaseGenericObjectType } from "../../../../../models/shared";
import { contactOrganizationRequestHandler } from "./utils/connectedLeadConversionContentHelper";

let convertedLeadData = {
  contactName: "",
  organizationName: "",
  dealName: "",
};

export const LeadConversionContentContainer = ({
  navContactName,
  navOrganizationName,
  navDealName,
  navLeadName,
  dealFieldList,
  contactFieldList,
  organizationFieldList,
  stagesLookupOptions,
  setDealFieldList,
  setConversionProcessing,
  appName,
  modelName,
  id,
  companyAvailable,
  leadContactOrganizationState,
  convertLeadData,
  setLeadContactOrganizationState,
  contactVariable,
  organizationVariable,
  resetValues,
  tableFieldsList,
  layoutIds,
  userPreferences,
  fetchContactData,
  fetchOrganizationData,
  setResponseData,
  removeModuleDataById,
}: ILeadConversionContentContainer) => {
  const { t } = useTranslation(["common"]);
  const [leadDeal, setLeadDeal] = React.useState({ checked: false });

  const [saveData] = useMutation(EXECUTE_CONVERSION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });
  const handleFormSave = (values: FormikValues) => {
    setConversionProcessing(true);
    const leadSaveDefaultObject: IMutationGeneratorResult =
      handleLeadConvertDataTransformation(
        values,
        leadDeal,
        companyAvailable,
        leadContactOrganizationState.organization,
        leadContactOrganizationState.contact,
        layoutIds,
        contactFieldList,
        organizationFieldList,
        dealFieldList
      );
    let dealName = leadSaveDefaultObject?.deal?.name
      ? leadSaveDefaultObject?.deal.name
      : "";
    let contactName = "";
    let organizationName = "";
    if (leadSaveDefaultObject?.contact) {
      contactName = leadConvertSaveDataHelper(
        "fullName",
        leadSaveDefaultObject.contact,
        leadContactOrganizationState.contact.selectedItem,
        convertLeadData
      );
    }
    if (leadSaveDefaultObject?.organization) {
      organizationName = leadConvertSaveDataHelper(
        "company",
        leadSaveDefaultObject.organization,
        leadContactOrganizationState.organization.selectedItem,
        convertLeadData
      );
    }
    convertedLeadData = {
      contactName: contactName,
      organizationName: organizationName,
      dealName: dealName,
    };
    try {
      saveData({
        variables: {
          modelName: "LeadConversionMapping",
          executeConversionInput: {
            sourceIds: [convertLeadData.id],
            defaults: leadSaveDefaultObject,
          },
        },
      }).then((response) => {
        if (
          response.data.executeConversion.messageKey.includes(
            "executeconversion-success"
          )
        ) {
          toast.success(`Lead converted successfully`);
          let dataArray = [];
          for (const key in response.data.executeConversion.data) {
            dataArray.push({
              [key]: response.data.executeConversion.data[key],
            });
          }
          removeModuleDataById(id, modelName);
          window.localStorage.setItem(
            "convertedLead",
            JSON.stringify({
              contactName: convertedLeadData.contactName,
              companyName: convertedLeadData.organizationName,
              dealName: convertedLeadData.dealName,
              data: dataArray,
              id: id,
            })
          );
          setConversionProcessing(false);
          router?.replace(
            appsUrlGenerator(appName, modelName, AllowedViews.converted, id)
          );
          return;
        }
        if (response.data?.executeConversion?.errors) {
          let errorMessage = "";
          for (const fieldName in response.data?.executeConversion?.errors) {
            if (fieldName !== "moduleName")
              errorMessage += `${fieldName} ${response.data?.executeConversion?.errors[fieldName]}\n`;
          }
          toast.error(
            `${response.data?.executeConversion?.errors.moduleName}: ${errorMessage}`
          );
          setConversionProcessing(false);
          return;
        }
        if (response.data.executeConversion.messageKey) {
          toast.error(response.data.executeConversion.message);
          setConversionProcessing(false);
          return;
        }
        toast.error(t("common:unknown-message"));
        setConversionProcessing(false);
      });
    } catch (error) {
      console.error(error);
      setConversionProcessing(false);
    }
  };

  const convertRecordItemSelect = (
    module: "contact" | "organization",
    record: BaseGenericObjectType,
    bypassData = false
  ) => {
    const data = handleItemSelect(
      record,
      leadContactOrganizationState[module].selectedItem
    );
    setLeadContactOrganizationState({
      ...leadContactOrganizationState,
      [module]: {
        ...leadContactOrganizationState[module],
        checked: true,
        createNew: false,
        showTable: true,
        selectedId: bypassData ? record.id : data?.length ? data[0].id : null,
        selectedItem: bypassData ? [record] : data,
      },
    });
  };

  const handlePageChange = (moduleName: string, pageNumber: number) => {
    contactOrganizationRequestHandler(
      moduleName === "contact" ? contactVariable : organizationVariable,
      pageNumber,
      fetchContactData,
      fetchOrganizationData,
      setResponseData,
      leadContactOrganizationState
    );
  };
  const handleResetValues = () => {
    setLeadContactOrganizationState(resetValues);
    setLeadDeal({ checked: false });
  };

  const handleCheckboxSelect = (
    module: string,
    createNew: boolean,
    showTable: boolean
  ) => {
    if (module === "contact" || module === "organization") {
      if (showTable && leadContactOrganizationState[module]?.data?.length) {
        convertRecordItemSelect(
          module,
          leadContactOrganizationState[module].data[0],
          true
        );
      } else {
        setLeadContactOrganizationState({
          ...leadContactOrganizationState,
          [module]: {
            ...leadContactOrganizationState[module],
            checked: createNew || showTable || false,
            createNew: createNew,
            showTable: showTable,
            selectedId:
              createNew === true
                ? null
                : leadContactOrganizationState[module].selectedId,
          },
        });
      }
    } else {
      setLeadDeal({ checked: !leadDeal.checked });
    }
  };

  return (
    <LeadConversionContent
      navContactName={navContactName}
      navOrganizationName={navOrganizationName}
      navDealName={navDealName}
      navLeadName={navLeadName}
      dealFieldList={dealFieldList}
      contactFieldList={contactFieldList}
      organizationFieldList={organizationFieldList}
      stagesLookupOptions={stagesLookupOptions}
      setDealFieldList={setDealFieldList}
      companyAvailable={companyAvailable}
      appName={appName}
      modelName={modelName}
      resetValues={resetValues}
      handleResetValues={handleResetValues}
      leadContactOrganizationState={leadContactOrganizationState}
      leadDeal={leadDeal}
      handleFormSave={handleFormSave}
      convertLeadData={convertLeadData}
      handleCheckboxSelect={handleCheckboxSelect}
      convertRecordItemSelect={convertRecordItemSelect}
      handlePageChange={handlePageChange}
      tableFieldsList={tableFieldsList}
      userPreferences={userPreferences}
    />
  );
};
