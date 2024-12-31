import React, { useContext } from "react";
import { toast } from "react-toastify";
import { FormikValues } from "formik";
import { useMutation } from "@apollo/client";
import { LeadConversionContainer } from "./LeadConversionContainer";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { SAVE_MUTATION } from "../../../../../../../graphql/mutations/saveMutation";
import { PageLoader } from "../../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  IMappingLabels,
  LeadConversionDataType,
} from "./LeadConversionMappingScreen";
import {
  BaseGenericObjectType,
  ILeadDropdownListType,
  SupportedApps,
} from "../../../../../../../models/shared";
import {
  handleFormSaveHelper,
  leadDropdownListHelper,
  leadMappingResponseDataHandler,
} from "./leadConversionMappingHelper";
import {
  checkMandatoryFields,
  dropdownListHelper,
  mandatoryFieldsExtractor,
} from "../conversionMappingHelper";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";

const leadMappingExcludedFieldNames: Set<string> = new Set([
  "record_status",
  "created_by",
  "created_at",
  "updated_by",
  "updated_at",
  "record_image",
  "owner_id",
  "layout_id",
  "parent_contact_id",
  "organization_id",
  "parent_organization_id",
  "contact_id",
  "deal_pipeline_id",
  "deal_stage_id",
]);

export const ConnectedLeadConversionMapping = ({
  leadConversionData,
  labelData,
  appName,
  rootPermissionData,
  setLeadConversionData,
  setRootPermissionData,
  moduleLoading,
}: {
  leadConversionData: LeadConversionDataType;
  labelData: IMappingLabels;
  appName: SupportedApps;
  rootPermissionData: Record<string, string | null>[];
  setLeadConversionData: (value: LeadConversionDataType) => void;
  setRootPermissionData: (value: Record<string, string | null>[]) => void;
  moduleLoading: boolean;
}) => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched } = generalModelStore;
  const [organizationList, setOrganizationList] = React.useState<
    ILeadDropdownListType[]
  >([]);
  const [contactList, setContactList] = React.useState<ILeadDropdownListType[]>(
    []
  );
  const [dealList, setDealList] = React.useState<ILeadDropdownListType[]>([]);
  const [leadListItems, setLeadListItems] = React.useState<
    ILeadDropdownListType[]
  >([]);
  const [originalListValues, setOriginalListValues] =
    React.useState<BaseGenericObjectType>({});
  const [layoutLoading, setLayoutLoading] = React.useState(true);
  const [changedValuesList, setChangedValuesList] = React.useState<string[]>(
    []
  );
  const [leadSaving, setLeadSaving] = React.useState(false);
  const [mandatoryFields, setMandatoryFields] = React.useState<
    Record<string, ICustomField[]>
  >({});
  const [errorMessage, setErrorMessage] = React.useState("");

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const dropdownChangeHandler = (
    changedValue: string,
    values: FormikValues
  ) => {
    if (Object.keys(originalListValues).length === 0) {
      setOriginalListValues(values);
    }
    let found = false;
    for (const val of changedValuesList) {
      if (changedValue === val) {
        found = true;
        break;
      }
    }
    if (!found) {
      setChangedValuesList([...changedValuesList, changedValue]);
    }
  };

  const handleFormSave = async (values: FormikValues) => {
    if (!changedValuesList.length) {
      toast.warning("No changes to save");
      return;
    }
    setLeadSaving(true);
    try {
      const fetchPromises = [];
      const { saveInputArray, modifiedRootPermissionData, message } =
        handleFormSaveHelper(
          values,
          changedValuesList,
          rootPermissionData,
          leadConversionData,
          organizationList,
          contactList,
          dealList,
          leadListItems,
          mandatoryFields
        );
      if (message.length) {
        toast.error(`Please select mandatory fields ${message}`);
        setErrorMessage(message);
      } else {
        setErrorMessage("");
      }
      for (let reqData of saveInputArray) {
        fetchPromises.push(
          await saveData({
            variables: reqData,
          })
        );
      }
      let errorCount = 0;
      Promise.all(fetchPromises).then((result) => {
        result.forEach((val) => {
          if (val.data.save.code !== 200) {
            errorCount += 1;
          }
        });
        if (errorCount > 0) {
          toast.error(`Failed to save mapping for ${errorCount} values`);
          setLeadSaving(false);
        } else {
          toast.success(`Successfully saved mapping`);
          const { leadConversionDataDict, list } =
            leadMappingResponseDataHandler(result, leadConversionData);
          setLeadConversionData(leadConversionDataDict);
          setOriginalListValues({ ...originalListValues, ...list });
          setChangedValuesList([]);
          setRootPermissionData(modifiedRootPermissionData);
          setLeadSaving(false);
        }
      });
    } catch (error) {
      console.error(error);
      setLeadSaving(false);
    }
  };

  React.useEffect(() => {
    const handleLayoutFetch = async () => {
      let mandatoryFieldsData: {
        contact: ICustomField[];
        organization: ICustomField[];
        deal: ICustomField[];
      } = { contact: [], organization: [], deal: [] };
      ["contact", "lead", "deal", "organization"]?.forEach(
        (moduleName: string) => {
          let fieldsListForModuleFromStore =
            genericModels[moduleName]?.fieldsList ?? [];

          if (moduleName === "lead") {
            setLeadListItems(
              fieldsListForModuleFromStore
                .filter((field) => field.readOnly === false && field.visible)
                .map((leadValue) => {
                  return {
                    value: leadValue.uniqueName.split(".").pop() || "",
                    label: leadValue.label.en,
                    dataType: leadValue.dataType,
                    uniqueName: leadValue.uniqueName,
                    dataTypeMetadata: leadValue.dataTypeMetadata,
                  };
                })
            );
          } else if (moduleName === "organization") {
            mandatoryFieldsData = {
              ...mandatoryFieldsData,
              organization: mandatoryFieldsExtractor(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames
              ),
            };
            setOrganizationList(
              leadDropdownListHelper(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames,
                {}
              )
            );
          } else if (moduleName === "contact") {
            mandatoryFieldsData = {
              ...mandatoryFieldsData,
              contact: mandatoryFieldsExtractor(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames
              ),
            };
            setContactList(
              leadDropdownListHelper(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames,
                {}
              )
            );
          } else if (moduleName === "deal") {
            mandatoryFieldsData = {
              ...mandatoryFieldsData,
              deal: mandatoryFieldsExtractor(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames
              ),
            };
            setDealList(
              leadDropdownListHelper(
                fieldsListForModuleFromStore,
                leadMappingExcludedFieldNames,
                {
                  expected_revenue: "expected_revenue",
                }
              )
            );
          }
        }
      );
      setMandatoryFields(mandatoryFieldsData);
      setLayoutLoading(false);
    };
    if (allLayoutFetched) {
      handleLayoutFetch();
    }
  }, [allLayoutFetched]);

  React.useEffect(() => {
    if (
      !errorMessage.length &&
      rootPermissionData.length &&
      Object.keys(mandatoryFields).length
    ) {
      const message = checkMandatoryFields(rootPermissionData, mandatoryFields);
      if (message.length) {
        setErrorMessage(message);
      } else {
        setErrorMessage("");
      }
    }
  }, [rootPermissionData, mandatoryFields]);

  if (moduleLoading) {
    return (
      <div className={"flex items-center justify-center h-screen text-xl"}>
        <PageLoader />
      </div>
    );
  }
  if (!leadConversionData) return null;
  return (
    <LeadConversionContainer
      leadMappingExcludedFieldNames={leadMappingExcludedFieldNames}
      leadListItems={leadListItems}
      organizationList={organizationList}
      contactList={contactList}
      dealList={dealList}
      leadConversionData={leadConversionData}
      dropdownChangeHandler={dropdownChangeHandler}
      layoutLoading={layoutLoading}
      handleFormSave={handleFormSave}
      changedValuesList={changedValuesList}
      setChangedValuesList={(value: string[]) => {
        setChangedValuesList(value);
      }}
      originalListValues={originalListValues}
      errorMessage={errorMessage}
      leadSaving={leadSaving}
      labelData={labelData}
    />
  );
};
