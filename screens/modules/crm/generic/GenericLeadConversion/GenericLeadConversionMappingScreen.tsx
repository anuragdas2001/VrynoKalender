import React from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { IRolePermission } from "../../../../../models/Accounts";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { ConnectedLeadConversion } from "./ConnectedLeadConversion";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  useCrmFetchLazyQuery,
  useCrmFetchQuery,
} from "../../shared/utils/operations";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import {
  IConvertLeadData,
  ILeadConversionMappingData,
  IMappedFieldList,
} from "./utils/genericLeadConversionInterfaces";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

export const GenericLeadConversionMappingScreen = observer(() => {
  const { appName, modelName, id } = getAppPathParts();
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const {
    genericModels,
    allLayoutFetched,
    allModulesFetched,
    userPreferences,
    removeModuleDataById,
  } = generalModelStore;
  const [viewPermission, setViewPermission] = React.useState(true);
  const [convertLeadData, setConvertLeadData] =
    React.useState<IConvertLeadData | null>(null);
  const [companyAvailable, setCompanyAvailable] = React.useState<
    null | boolean
  >(null);

  const [mappedFieldsList, setMappedFieldsList] =
    React.useState<IMappedFieldList>({
      contact: [],
      organization: [],
      deal: [],
    });
  const [masterMappedFieldsList, setMasterMappedFieldsList] = React.useState<
    Record<string, string>
  >({});
  const [conversionProcessing, setConversionProcessing] = React.useState(false);
  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [leadDataLoading, setLeadDataLoading] = React.useState(true);

  const [navContactName, setNavContactName] = React.useState("Contact");
  const [navOrganizationName, setNavOrganizationName] =
    React.useState("Organization");
  const [navDealName, setNavDealName] = React.useState("Deal");
  const [navLeadName, setNavLeadName] = React.useState("Lead");

  const [getLeadData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        const data = responseOnCompletion?.fetch?.data;
        data[0]?.company
          ? setCompanyAvailable(true)
          : setCompanyAvailable(false);
        const updatedData: Record<string, string | null> = {};
        for (const key in data[0]) {
          updatedData[key.includes("fields.") ? key.split(".")[1] : key] =
            data[0][key];
        }
        setConvertLeadData({
          ...updatedData,
          id: updatedData?.id,
          contactName: updatedData?.name,
          fullName: `${updatedData?.firstName ? updatedData?.firstName : ""} ${
            updatedData?.name ? updatedData?.name : ""
          }`.trim(),
          email: updatedData?.email,
          company: updatedData?.company,
          phoneNumber: updatedData?.phoneNumber,
        });
      }
      setLeadDataLoading(false);
    },
  });

  React.useEffect(() => {
    if (allLayoutFetched && appName) {
      let fieldsListFromStore = genericModels["lead"]?.fieldsList;
      if (fieldsListFromStore?.length > 0) {
        getLeadData({
          variables: {
            modelName: modelName,
            fields: fieldsListFromStore
              .filter((field) => field.visible)
              .map((field) =>
                field.systemDefined ? field.name : `fields.${field.name}`
              ),
            filters: [
              { name: "id", operator: "eq", value: [id] },
              { name: "recordStatus", operator: "in", value: ["a", "i"] },
            ],
            options: {
              processedData: true,
            },
          },
        });
      }
    }
  }, [allLayoutFetched, appName]);

  useCrmFetchQuery<ILeadConversionMappingData>({
    variables: {
      modelName: "LeadConversionMapping",
      fields: [
        "name",
        "label",
        "uniqueKey",
        "sourceLeadFieldUniqueName",
        "destinationContactFieldUniqueName",
        "destinationOrganizationFieldUniqueName",
        "destinationDealFieldUniqueName",
      ],
      filters: [],
    },
    onDataRecd: (data) => {
      if (data) {
        let contactFields: string[] = [];
        let organizationFields: string[] = [];
        let dealFields: string[] = [];
        for (const val of data) {
          val.destinationContactFieldUniqueName &&
            contactFields.push(val.destinationContactFieldUniqueName);
          val.destinationOrganizationFieldUniqueName &&
            organizationFields.push(val.destinationOrganizationFieldUniqueName);
          val.destinationDealFieldUniqueName &&
            dealFields.push(val.destinationDealFieldUniqueName);
        }
        let list = {};
        for (const val of data) {
          const contactField = val.destinationContactFieldUniqueName;
          const organizationField = val.destinationOrganizationFieldUniqueName;
          const dealField = val.destinationDealFieldUniqueName;
          if (contactField)
            list = {
              ...list,
              [contactField]: val.sourceLeadFieldUniqueName,
            };
          if (organizationField) {
            list = {
              ...list,
              [organizationField]: val.sourceLeadFieldUniqueName,
            };
          }
          if (dealField) {
            list = { ...list, [dealField]: val.sourceLeadFieldUniqueName };
          }
        }
        setMasterMappedFieldsList(list);
        setMappedFieldsList({
          contact: contactFields,
          organization: organizationFields,
          deal: dealFields,
        });
      }
    },
  });

  React.useEffect(() => {
    if (allModulesFetched) {
      Object.keys(genericModels)?.forEach((module) => {
        let moduleData = genericModels[module]?.moduleInfo;
        if (moduleData?.uniqueName === "crm.contact") {
          setNavContactName(moduleData?.label.en);
        }
        if (moduleData?.uniqueName === "crm.organization") {
          setNavOrganizationName(moduleData?.label.en);
        }
        if (moduleData?.uniqueName === "crm.deal") {
          setNavDealName(moduleData?.label.en);
        }
        if (moduleData?.uniqueName === "crm.lead") {
          setNavLeadName(moduleData?.label.en);
        }
      });
      setModuleLoading(false);
    }
  }, [allModulesFetched]);

  //fetching permission - start
  const [fetchActivePermissions] = useCrmFetchLazyQuery<IRolePermission>({
    fetchPolicy: "no-cache",
    onDataRecd: (data) => {
      if (!data?.length) {
        toast.error("Require convert permission");
        setViewPermission(false);
      }
    },
  });

  React.useEffect(() => {
    if (!user) return;
    fetchActivePermissions({
      variables: {
        modelName: "RolePermission",
        fields: ["id", "modelName", "roleKey", "permissionKey", "recordStatus"],
        filters: [
          { name: "permissionKey", operator: "eq", value: ["convert-lead"] },
          {
            name: "roleKey",
            operator: "in",
            value: user?.roleKeys ? user?.roleKeys : [],
          },
        ],
      },
    });
  }, [user]);
  //fetching permission - end

  return viewPermission ? (
    conversionProcessing || moduleLoading || leadDataLoading ? (
      <div className="p-6">
        {ItemsLoader({ currentView: "List", loadingItemCount: 4 })}
      </div>
    ) : convertLeadData ? (
      <ConnectedLeadConversion
        convertLeadData={convertLeadData}
        navContactName={navContactName}
        navOrganizationName={navOrganizationName}
        navDealName={navDealName}
        navLeadName={navLeadName}
        companyAvailable={companyAvailable}
        mappedFieldsList={mappedFieldsList}
        setConversionProcessing={(value: boolean) =>
          setConversionProcessing(value)
        }
        appName={appName}
        modelName={modelName}
        id={id}
        masterMappedFieldsList={masterMappedFieldsList}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        userPreferences={userPreferences}
        removeModuleDataById={removeModuleDataById}
      />
    ) : (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col mt-6 items-center justify-center"
        id="no-lead-data"
      >
        <div className="w-full max-w-sm max-h-64 flex flex-col items-center justify-center h-full rounded-xl p-6 bg-white">
          <p className="font-medium w-full text-center">Lead data not found</p>
        </div>
      </div>
    )
  ) : (
    <NoViewPermission customMessage="You do not have permission to convert" />
  );
});
