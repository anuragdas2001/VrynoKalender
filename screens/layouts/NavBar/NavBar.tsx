import { RightPanel } from "./RightPanel";
import { ConnectedMainMenu } from "./ConnectedMainMenu";
import React from "react";
import { sliderWindowType } from "../../modules/crm/shared/components/SliderWindow";
import { IFormModalObject } from "../../modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { MixpanelActions } from "../../Shared/MixPanel";
import { useLazyQuery } from "@apollo/client";
import {
  INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
  INSTANCE_LIST_QUERY,
  InstanceListData,
  InstanceSubdomainData,
} from "../../../graphql/queries/instances";
import { SupportedApps } from "../../../models/shared";
import { IInstance, User } from "../../../models/Accounts";
import { useCrmFetchLazyQuery } from "../../modules/crm/shared/utils/operations";
import { INavigation } from "../../../models/INavigation";
import { toast } from "react-toastify";
import { IGenericModel } from "../../../stores/RootStore/GeneralStore/GenericModelStore";

export const NavBar = ({
  appName,
  disableSearchButton,
  navbarColor,
  navbarTextColor,
  allNotificationClass,
  setAllNotificationClass,
  setQuickAddModal,
  setGlobalSearchModal,
  importAllInstances,
  addInstance,
  appMessage,
  instanceMessage,
  instances,
  user,
  removeModuleDataById,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  navigations,
  importNavigations,
}: {
  appName: SupportedApps;
  disableSearchButton: boolean;
  navbarColor?: string;
  navbarTextColor?: string;
  allNotificationClass: string;
  setAllNotificationClass: (value: string) => void;
  setQuickAddModal: (value: IFormModalObject) => void;
  setGlobalSearchModal: (value: sliderWindowType) => void;
  addInstance: (instance: IInstance) => void;
  appMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  instanceMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  user: User | null;
  instances: IInstance[];
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
  importAllInstances: (
    instances: IInstance[],
    pageNumber: number,
    itemsCount: number,
    pageSize?: number
  ) => void;
  genericModels: IGenericModel; //manipulate by karan  have to remove null to function original like before
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  navigations: INavigation[];
  importNavigations: (
    navigations: INavigation[],
    addItemAtIndex?: number
  ) => void;
}) => {
  const [currentInstance, setCurrentInstance] =
    React.useState<IInstance | null>(null);

  const [instanceName, setInstanceName] = React.useState("");
  const [instanceDataLoading, setInstanceDataLoading] = React.useState(true);
  const [viewPermission, setViewPermission] = React.useState(true);
  const [fetchNavigations] = useCrmFetchLazyQuery<INavigation>({
    fetchPolicy: "cache-first",
  });
  const [moduleNamesList, setModuleNamesList] = React.useState<string[] | null>(
    null
  );
  const [filteredNavigations, setFilteredNavigation] = React.useState<
    INavigation[]
  >(
    navigations.filter(
      (val) => val.visible && val.groupKey === "default-navigation"
    )
  );

  const [getInstances] = useLazyQuery<InstanceListData>(INSTANCE_LIST_QUERY, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion.instances.count >= 0) {
        importAllInstances(
          responseOnCompletion.instances.data,
          1,
          responseOnCompletion.instances.count
        );
      }
      if (responseOnCompletion.instances.count > 1) {
        getInstanceViaSubdomain({
          variables: { subdomain: window.location.hostname.split(".")[0] },
        });
      } else {
        handleInstanceFound(responseOnCompletion.instances.data[0]);
      }
    },
    onError: (error) => {
      getInstanceViaSubdomain({
        variables: { subdomain: window.location.hostname.split(".")[0] },
      });
    },
  });

  const [getInstanceViaSubdomain] = useLazyQuery<InstanceSubdomainData>(
    INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
    {
      fetchPolicy: "cache-first",
      nextFetchPolicy: "standby",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion) {
          if (
            responseOnCompletion?.getSubdomainInstance?.messageKey?.includes(
              "success"
            ) &&
            responseOnCompletion?.getSubdomainInstance?.data
          ) {
            const instance = responseOnCompletion?.getSubdomainInstance?.data;
            addInstance(instance);
            handleInstanceFound(instance);
          } else {
            toast.error("No instance found");
          }
        }
      },
    }
  );

  const handleInstanceFound = (instance: IInstance) => {
    setInstanceName(instance.name);
    setCurrentInstance(instance);
    setInstanceDataLoading(false);
    MixpanelActions.register({
      instanceId: instance.id,
    });
  };

  React.useEffect(() => {
    getInstances();
  }, []);

  React.useEffect(() => {
    if (navigations.length === 0) {
      fetchNavigations({
        variables: {
          modelName: "NavigationItem",
          fields: [
            "label",
            "groupKey",
            "uniqueName",
            "navType",
            "name",
            "visible",
            "order",
            "systemDefined",
            "parentNavigation",
            "navTypeMetadata",
          ],
          filters: [],
        },
      }).then((result) => {
        if (result?.data?.fetch?.data) {
          if (!moduleNamesList) {
            setModuleNamesList(
              result?.data?.fetch?.data
                .filter(
                  (val) => val.visible && val.groupKey === "default-navigation"
                )
                .map((val) => val.navTypeMetadata.moduleName)
                .filter((val) => val)
            );
          }
          importNavigations(result.data.fetch.data);
          setViewPermission(true);
        } else if (result?.data?.fetch?.messageKey.includes("requires-view")) {
          toast.error(result?.data?.fetch?.message);
          setViewPermission(false);
        }
      });
    } else {
      setFilteredNavigation([
        ...navigations.filter(
          (val) => val.visible && val.groupKey === "default-navigation"
        ),
      ]);
    }
  }, [navigations]);

  return (
    <div
      style={{
        backgroundColor: navbarColor ?? "white",
        color: !navbarColor ? "black" : navbarTextColor ?? "black",
      }}
      className={`origin-top-right shadow-md shadow-gray-100 sticky ${
        appMessage?.length > 0 && instanceMessage?.length > 0
          ? "top-10"
          : appMessage?.length > 0 || instanceMessage?.length > 0
          ? "top-5"
          : "top-0"
      } right-0 z-[600] w-screen h-20 sm:h-21.5 md:h-15 flex flex-col justify-center`}
    >
      <div className="w-full h-full flex gap-x-4 items-center justify-between pl-5 pr-8">
        <ConnectedMainMenu
          companyLogoData={currentInstance?.logo}
          instanceDataLoading={instanceDataLoading}
          instanceName={instanceName}
          navbarColor={navbarColor}
          navbarTextColor={!navbarColor ? "black" : navbarTextColor ?? "black"}
          filteredNavigations={filteredNavigations}
          viewPermission={viewPermission}
        />
        <RightPanel
          appName={appName}
          navbarColor={navbarColor}
          filteredNavigations={filteredNavigations}
          navbarTextColor={
            !navbarColor ? "black" : navbarTextColor ?? "darkslategrey"
          }
          disableButton={disableSearchButton}
          setQuickAddModal={(value) => setQuickAddModal(value)}
          setGlobalSearchModal={(value) => setGlobalSearchModal(value)}
          instances={instances?.filter((instance) => instance)}
          currentInstance={currentInstance}
          setAllNotificationClass={setAllNotificationClass}
          allNotificationClass={allNotificationClass}
          user={user}
          removeModuleDataById={removeModuleDataById}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          allModulesFetched={allModulesFetched}
        />
      </div>
    </div>
  );
};
