import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SupportedApps } from "../../../../../models/shared";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { OperationVariables, QueryResult, useLazyQuery } from "@apollo/client";
import {
  MODULE_DATA_SHARING_RULE_QUERY,
  IFetchModuleDataSharingRule,
  PROFILE_DATA_QUERY,
  IFetchProfile,
} from "../../../../../graphql/queries/dataSharingQueries";
import {
  createTreeInRecursion,
  profileDataGenerator,
} from "./utils/dataProfileHelper";
import { IProfileData } from "../../../../../models/DataSharingModels";
import { TreeNodeClass } from "./utils/TreeNodeClass";
import { DataSharingContainer } from "./DataSharingContainer";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

export const ConnectedDataSharing = observer(() => {
  const { t } = useTranslation(["common"]);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, moduleViewPermission, allModulesFetched } =
    generalModelStore;
  const [selectedView, setSelectedView] = React.useState<
    "Profile" | "Organization"
  >("Profile");
  const [rootNode, setRootNode] = React.useState<TreeNodeClass | null>(null);
  const [profileData, setProfileData] = React.useState<IProfileData[]>([]);
  const [allParentIdOptions, setAllParentIdOptions] = React.useState<
    { value: string | null; label: string }[]
  >([]);
  const [profileDataLoading, setProfileDataLoading] =
    React.useState<boolean>(true);
  const [profileDataDict, setProfileDataDict] = React.useState<
    Record<string, IProfileData[]>
  >({});
  const [moduleFetchLoading, setModuleFetchLoading] = React.useState(true);
  const [moduleErrorLoadingPage, setModuleErrorLoadingPage] =
    React.useState(false);
  const [modulesData, setModulesData] = React.useState<IModuleMetadata[]>([]);
  const [moduleDataSharingDataLoading, setModuleDataSharingDataLoading] =
    React.useState(true);
  const [moduleDataRulesInitialValue, setModuleDataRulesInitialValue] =
    React.useState<Record<string, boolean>>({});
  const [moduleDataSharingRuleData, setModuleDataSharingRuleData] =
    React.useState<Record<string, string>>({});
  const [moduleDataOverallLoading, setModuleDataOverallLoading] =
    React.useState(false);

  const [getProfileData] = useLazyQuery<IFetchProfile>(PROFILE_DATA_QUERY, {
    nextFetchPolicy: "no-cache",
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const [getModuleDataSharingRuleData] =
    useLazyQuery<IFetchModuleDataSharingRule>(MODULE_DATA_SHARING_RULE_QUERY, {
      nextFetchPolicy: "no-cache",
      fetchPolicy: "cache-first",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    });

  const handleProfileDataResponse = (
    response: QueryResult<IFetchProfile, OperationVariables>
  ) => {
    if (response?.data?.fetchProfile?.messageKey?.includes("-success")) {
      const dataSharingResult = response?.data?.fetchProfile?.data;
      const { rootNode, nodesDict, addProfileParentOptions } =
        profileDataGenerator(dataSharingResult);
      if (rootNode) createTreeInRecursion(rootNode, nodesDict);
      setRootNode(rootNode);
      setProfileDataDict(nodesDict);
      setAllParentIdOptions(addProfileParentOptions);
      setProfileData(dataSharingResult);
    } else if (response?.data?.fetchProfile?.message) {
      toast.error(response?.data?.fetchProfile?.message);
    } else {
      toast.error(t("common:unknown-message"));
    }
    setProfileDataLoading(false);
  };

  const handleModuleDataSharingRuleResponse = (
    response: QueryResult<IFetchModuleDataSharingRule, OperationVariables>
  ) => {
    if (
      response?.data?.fetchModuleDataSharingRule?.messageKey?.includes(
        "-success"
      )
    ) {
      const dataSharingResult =
        response?.data?.fetchModuleDataSharingRule?.data;
      let initialValues: Record<string, boolean> = {};
      let moduleDataSharingRuleFetchedData: Record<string, string> = {};
      for (const data of dataSharingResult) {
        initialValues[`${data.moduleName}-${data.modulePermission}`] = true;
        moduleDataSharingRuleFetchedData[data.moduleName] = data.id;
      }
      setModuleDataRulesInitialValue(initialValues);
      setModuleDataSharingRuleData(moduleDataSharingRuleFetchedData);
    } else if (response?.data?.fetchModuleDataSharingRule?.message) {
      toast.error(response?.data?.fetchModuleDataSharingRule?.message);
    } else {
      toast.error(t("common:unknown-message"));
    }
    setModuleDataSharingDataLoading(false);
  };

  React.useEffect(() => {
    if (allModulesFetched && moduleViewPermission) {
      setModuleFetchLoading(false);
      setModuleErrorLoadingPage(false);
      setModulesData([
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter(
            (model) =>
              model?.name !== "quotedItem" &&
              model?.name !== "orderedItem" &&
              model?.name !== "invoicedItem" &&
              model?.name !== "purchaseItem"
          )
          ?.filter((model) => model !== undefined),
      ]);
    }
  }, [allModulesFetched, moduleViewPermission]);

  React.useEffect(() => {
    getProfileData({
      variables: {
        filters: [],
      },
    }).then((response) => handleProfileDataResponse(response));
    getModuleDataSharingRuleData({
      variables: {
        filters: [],
      },
    }).then((response) => handleModuleDataSharingRuleResponse(response));
  }, []);

  React.useEffect(() => {
    if (
      !moduleFetchLoading &&
      !moduleDataSharingDataLoading &&
      !moduleErrorLoadingPage &&
      moduleViewPermission
    ) {
      let initialStateObject: Record<string, boolean> = {};
      for (const data of modulesData) {
        if (!moduleDataSharingRuleData[data.name])
          initialStateObject[`${data.name}-read/modify/remove`] = true;
      }
      setModuleDataRulesInitialValue({
        ...initialStateObject,
        ...moduleDataRulesInitialValue,
      });
      setModuleDataOverallLoading(true);
    }
  }, [moduleFetchLoading, moduleDataSharingDataLoading]);

  return (
    <DataSharingContainer
      moduleDataRulesInitialValue={moduleDataRulesInitialValue}
      setModuleDataRulesInitialValue={(value: Record<string, boolean>) =>
        setModuleDataRulesInitialValue(value)
      }
      selectedView={selectedView}
      setSelectedView={(value: "Profile" | "Organization") =>
        setSelectedView(value)
      }
      profileDataLoading={profileDataLoading}
      rootNode={rootNode}
      setRootNode={(value: TreeNodeClass | null) => setRootNode(value)}
      allParentIdOptions={allParentIdOptions}
      profileData={profileData}
      setProfileData={(value: IProfileData[]) => setProfileData(value)}
      setAllParentIdOptions={(
        value: {
          value: string | null;
          label: string;
        }[]
      ) => setAllParentIdOptions(value)}
      profileDataDict={profileDataDict}
      setProfileDataDict={(value: Record<string, IProfileData[]>) =>
        setProfileDataDict(value)
      }
      moduleDataOverallLoading={moduleDataOverallLoading}
      moduleViewPermission={moduleViewPermission}
      modulesData={modulesData}
      moduleDataSharingRuleData={moduleDataSharingRuleData}
      setModuleDataSharingRuleData={(value: Record<string, string>) =>
        setModuleDataSharingRuleData(value)
      }
    />
  );
});
