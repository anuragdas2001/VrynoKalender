import { useFormikContext } from "formik";
import React from "react";
import FormCheckBox from "../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { ICustomField } from "../../../../../../models/ICustomField";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";
import { getAppPathParts } from "../../../shared/utils/getAppPathParts";
import { LeadConversionConvertForm } from "./LeadConversionConvertForm";
import {
  IConvertLeadData,
  ILeadContactOrganization,
  ILeadDeal,
} from "../utils/genericLeadConversionInterfaces";
import { LeadContactOrganizationContainer } from "./LeadContactOrganizationContainer";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { getCountryCodeFromPreference } from "../../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../../models/shared";

export const LeadConversionMappingContainer = ({
  convertLeadData,
  handleCheckboxSelect,
  leadDeal,
  activePipeline,
  navContactName,
  navOrganizationName,
  navDealName,
  navLeadName,
  dealFieldList,
  stagesLookupOptions,
  contactFieldList,
  organizationFieldList,
  convertRecordItemSelect,
  companyAvailable,
  onPageChange,
  leadContactOrganizationState,
  setDealFieldList,
  tableFieldsList,
  userPreferences,
}: {
  convertLeadData: IConvertLeadData;
  handleCheckboxSelect: (
    module: string,
    createNew: boolean,
    showModal: boolean
  ) => void;
  leadDeal: ILeadDeal;
  activePipeline: IModuleMetadata | null;
  navContactName: string;
  navOrganizationName: string;
  navDealName: string;
  navLeadName: string;
  dealFieldList: ICustomField[];
  stagesLookupOptions: Record<string, string>[];
  contactFieldList: ICustomField[];
  organizationFieldList: ICustomField[];
  userPreferences: IUserPreference[];
  convertRecordItemSelect: (
    module: "contact" | "organization",
    record: BaseGenericObjectType
  ) => void;
  companyAvailable: boolean | null;
  onPageChange: (moduleName: string, pageNumber: number) => void;
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  setDealFieldList: (value: ICustomField[]) => void;
  tableFieldsList: {
    contact: ICustomField[];
    organization: ICustomField[];
  };
}) => {
  const { appName, id } = getAppPathParts();
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [selectedModule, setSelectedModule] = React.useState<string>("contact");

  React.useEffect(() => {
    if (dealFieldList.length) {
      setFieldValue("ownerId", cookieUserStore?.getUserId() || null);
    }
  }, [dealFieldList]);

  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);

  React.useEffect(() => {
    if (activePipeline && dealFieldList?.length) {
      setFieldValue("deal-dealPipelineId", activePipeline.id);
      setFieldValue(
        "deal-dealStageId",
        activePipeline.stages?.length ? activePipeline.stages[0] : ""
      );
    }
  }, [activePipeline]);

  React.useEffect(() => {
    if (dealFieldList.length && values["deal-dealPipelineId"]) {
      const updatedFormFieldsList: ICustomField[] = [];
      const dealPipelineField = dealFieldList.filter(
        (field) => field.name === "deal-dealPipelineId" && field.systemDefined
      );
      const stages =
        dealPipelineField[0].dataTypeMetadata.fieldDependencyMapping.filter(
          (stage: { parentRecordId: string }) =>
            stage.parentRecordId === values["deal-dealPipelineId"]
        )[0]?.childRecordIds || [];
      dealFieldList.forEach((field) => {
        if (field.name === "deal-dealStageId") {
          const lookupOptions = [];
          for (let i = 0; i < stages.length; i++) {
            for (let j = 0; j < stagesLookupOptions.length; j++) {
              if (stages[i] === stagesLookupOptions[j].id) {
                lookupOptions.push(stagesLookupOptions[j]);
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
        } else {
          updatedFormFieldsList.push(field);
        }
      });
      const sID =
        stages.length && values["deal-dealStageId"]
          ? stages.filter((id: string) => id === values["deal-dealStageId"])[0]
          : "";
      const stageId = sID?.length ? sID : stages.length ? stages[0] : "";
      setDealFieldList(updatedFormFieldsList);
      setFieldValue("deal-dealStageId", stageId);
    }
  }, [values["deal-dealPipelineId"]]);

  const handleSelectedModule = (name: string) => setSelectedModule(name);

  return (
    <div className="flex flex-col gap-y-4 w-full h-full p-6">
      <div className={`w-full rounded-[0.6rem] bg-white relative p-4`}>
        {/* contact - start */}
        {/* <div className="overflow-hidden"> */}
        <div className={`relative ${selectedModule === "contact" ? "" : ""}`}>
          <LeadContactOrganizationContainer
            convertLeadData={convertLeadData}
            leadModuleData={leadContactOrganizationState.contact}
            moduleFieldList={contactFieldList}
            navModuleName={navContactName}
            handleCheckboxSelect={handleCheckboxSelect}
            convertRecordItemSelect={convertRecordItemSelect}
            selectedItems={leadContactOrganizationState.contact.selectedItem}
            appName={appName}
            id={id}
            moduleName="contact"
            onPageChange={onPageChange}
            tableFieldsList={tableFieldsList.contact}
            handleSelectedModule={handleSelectedModule}
            countryCodeInUserPreference={countryCodeInUserPreference}
          />
        </div>
        {/* contact - end */}

        {/* organization - start */}
        {/* <div className="overflow-hidden mt-4"> */}
        <div
          className={`relative mt-4 ${
            selectedModule === "organization" ? "" : ""
          }`}
        >
          <LeadContactOrganizationContainer
            convertLeadData={convertLeadData}
            leadModuleData={leadContactOrganizationState.organization}
            moduleFieldList={organizationFieldList}
            navModuleName={navOrganizationName}
            handleCheckboxSelect={handleCheckboxSelect}
            convertRecordItemSelect={convertRecordItemSelect}
            selectedItems={
              leadContactOrganizationState.organization.selectedItem
            }
            appName={appName}
            id={id}
            moduleName="organization"
            contactSelected={leadContactOrganizationState.contact}
            onPageChange={onPageChange}
            tableFieldsList={tableFieldsList.organization}
            handleSelectedModule={handleSelectedModule}
            countryCodeInUserPreference={countryCodeInUserPreference}
          />
        </div>
        {/* organization - end */}

        {/* deal - start */}
        {leadContactOrganizationState.contact.checked &&
          (leadContactOrganizationState.organization.checked ||
            !companyAvailable) && (
            <div className={`mt-4 ${selectedModule === "deal" ? "" : ""}`}>
              <FormCheckBox
                onChange={() => handleCheckboxSelect("deal", false, false)}
                name={"new-deal"}
                label={`Create a new ${navDealName} for this ${navLeadName}`}
                value={leadDeal.checked}
                labelSize="text-sm"
                marginY="mt-4"
              />
              {leadDeal.checked && (
                <LeadConversionConvertForm
                  fieldsList={dealFieldList}
                  id={id}
                  moduleName={"deal"}
                  handleSelectedModule={handleSelectedModule}
                  countryCodeInUserPreference={countryCodeInUserPreference}
                />
              )}
            </div>
          )}
        {/* deal - end */}

        <div
          className={`mt-4 p-6 rounded-md bg-vryno-header-color grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 ${
            selectedModule === "owner" ? "" : ""
          }`}
          onClick={() => handleSelectedModule("owner")}
        >
          {dealFieldList
            .filter((field) => field.name === "ownerId")
            .flatMap((field: ICustomField, index: number) => {
              return (
                <FormFieldPerDataType
                  key={index}
                  field={field}
                  isSample={false}
                  setFieldValue={setFieldValue}
                  modelName="deal"
                  editMode={false}
                  id={id}
                  values={values}
                  labelValue={"Owner of new Records"}
                  countryCodeInUserPreference={countryCodeInUserPreference}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
