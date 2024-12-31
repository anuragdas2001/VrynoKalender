import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { DashboardSkeletonLoader } from "../../../../../components/TailwindControls/ContentLoader/Card/DashboardSkeletonLoader";
import { GenericBackHeaderLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/GenericBackHeaderLoader";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { AccountModels } from "../../../../../models/Accounts";
import { AppModels } from "../../../../../models/AppModels";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { IUserPreference, SupportedApps } from "../../../../../models/shared";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { DashboardScreen } from "./DashboardScreen";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { useTranslation } from "react-i18next";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { range } from "lodash";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { observer } from "mobx-react-lite";

export const ConnectedDashboardScreen = observer(() => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const [currentDashboard, setCurrentDashboard] =
    React.useState<IDashboardDetails>();
  let { appName, modelName } = getAppPathParts();
  const { t } = useTranslation(["common"]);
  const [dashboards, setDashboards] = React.useState<IDashboardDetails[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(false);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allLayoutFetched,
    userPreferences,
    importUserPreferences,
  } = generalModelStore;
  const [defaultDashboard, setDefaultDashboard] = React.useState<string>();
  const [viewPermission, setViewPermission] = React.useState<boolean>(true);
  const [dataFetchLoading, setDataFetchLoading] = React.useState<boolean>(true);
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    item: IDashboardDetails | null;
  }>({ visible: false, item: null });
  const [deleteProcessing, setDeleteProcessing] =
    React.useState<boolean>(false);

  const [getDashboards] = useLazyQuery<FetchData<IDashboardDetails>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
    }
  );

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
          if (responseOnCompletion.fetch.data[0]) {
            let defaultDashboard = responseOnCompletion.fetch.data[0]
              .defaultPreferences.dashboard
              ? responseOnCompletion.fetch.data[0].defaultPreferences.dashboard
              : undefined;
            setDefaultDashboard(defaultDashboard);
          }
        }
        handleSetCurrentDashboard(responseOnCompletion.fetch.data);
        importUserPreferences(responseOnCompletion.fetch.data);
      }
    },
  });

  const [saveUserPreference] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) =>
      handleSavePreferenceResponse(responseOnCompletion, "update"),
  });

  const [getUserPreferencesForWidgetSize] = useLazyQuery<
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
        importUserPreferences(responseOnCompletion.fetch.data);
      }
    },
  });

  const [saveUserPreferenceForWidgetSize] = useMutation<
    SaveData<IUserPreference>,
    SaveVars<IUserPreference>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) =>
      handleSavePreferenceResponse(responseOnCompletion, "size"),
  });

  const handleSavePreferenceResponse = (
    responseOnCompletion: SaveData<IUserPreference>,
    type: "update" | "size"
  ) => {
    if (
      responseOnCompletion.save.data &&
      responseOnCompletion.save.data.id &&
      responseOnCompletion.save.messageKey.includes("-success")
    ) {
      Toast.success(responseOnCompletion.save.message);
      const variables = {
        modelName: AccountModels.Preference,
        fields: ["id", "serviceName", "defaultPreferences"],
        filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
      };
      type === "update"
        ? getUserPreferences({ variables })
        : getUserPreferencesForWidgetSize({
            variables,
          });
      return;
    }
    if (responseOnCompletion.save.messageKey) {
      Toast.error(responseOnCompletion.save.message);
      return;
    }
    Toast.error(t("common:unknown-message"));
    return;
  };

  const [deleteDashboard] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        Toast.success(responseOnCompletion.save.message);
        setDashboards(
          dashboards.filter(
            (dashboard) => dashboard.id !== responseOnCompletion.save.data.id
          )
        );
        if (defaultDashboard === responseOnCompletion.save.data.id) {
          saveUserPreference({
            variables: {
              id:
                userPreferences &&
                userPreferences.length > 0 &&
                userPreferences[0].id
                  ? userPreferences[0].id
                  : null,
              modelName: AccountModels.Preference,
              saveInput: {
                defaultPreferences: { ...userPreferences, dashboard: null },
                serviceName: "crm",
              },
            },
          });
        }
        setDeleteModal({ visible: false, item: null });
        setDeleteProcessing(false);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setDeleteProcessing(false);
        return;
      }
      setDeleteProcessing(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  const handlePreferencesChange = (item: IDashboardDetails, value: boolean) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    saveUserPreference({
      variables: {
        id: updatedUserPreferences ? updatedUserPreferences.id : null,
        modelName: AccountModels.Preference,
        saveInput: {
          defaultPreferences: {
            ...defaultPreferences,
            dashboard: value === true ? item.id : null,
          },
          serviceName: SupportedApps.crm,
        },
      },
    });
  };

  React.useEffect(() => {
    if (initialLoad) return;
    getDashboards({
      variables: {
        modelName: AppModels.Dashboard,
        fields: ["id", "name", "widgets", "createdBy"],
        filters: [],
      },
    }).then(async (responseOnCompletion) => {
      if (responseOnCompletion?.data?.fetch?.messageKey.includes("-success")) {
        let dashboardCount = responseOnCompletion?.data?.fetch?.count;
        let dashboardsList: IDashboardDetails[] = [
          ...responseOnCompletion?.data?.fetch?.data,
        ];
        const handleDashboardFetch = async () => {
          const pageCount = dashboardCount / 50;
          const fetchPromise = range(2, pageCount + 1)?.map(
            async (pageNumber: number) => {
              const response = await getDashboards({
                variables: {
                  modelName: AppModels.Dashboard,
                  fields: ["id", "name", "widgets", "createdBy"],
                  filters: [],
                  pageNumber: pageNumber,
                },
              });
              return response.data?.fetch;
            }
          );

          await Promise.all(fetchPromise).then((response) => {
            for (let resp of response) {
              if (resp?.messageKey?.includes("-success")) {
                dashboardsList = [...dashboardsList, ...resp?.data];
              }
            }
          });
        };
        if (dashboardCount > 50) {
          await handleDashboardFetch();
        }
        await getUserPreferences({
          variables: {
            modelName: AccountModels.Preference,
            fields: ["id", "serviceName", "defaultPreferences"],
            filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
          },
        }).catch((error) => console.log("Preference fetch error"));
        setDashboards(dashboardsList);
        setDataFetchLoading(false);
        if (dashboardCount !== dashboardsList?.length) {
          Toast.error("Unknown Error");
        }
        setViewPermission(true);
        setInitialLoad(true);
        return;
      } else if (
        responseOnCompletion?.data?.fetch?.messageKey.includes("requires-view")
      ) {
        Toast.error(responseOnCompletion?.data?.fetch?.message);
        setViewPermission(false);
        setDataFetchLoading(false);
        return;
      }
      Toast.error("Unknown Error");
      setDataFetchLoading(false);
      return;
    });
  }, [initialLoad]);

  const handleSetCurrentDashboard = (userPreferences: IUserPreference[]) => {
    if (userPreferences.length > 0) {
      let currentDashboard = dashboards.filter(
        (dashboard) =>
          dashboard.id === userPreferences[0]?.defaultPreferences?.dashboard
      );
      if (currentDashboard.length === 0) {
        let currentDashboard = dashboards.filter((dashboard) => !dashboard.id);
        setCurrentDashboard(currentDashboard[0]);
      } else {
        setCurrentDashboard(currentDashboard[0]);
      }
    } else {
      let currentDashboard = dashboards.filter((dashboard) => !dashboard.id);
      setCurrentDashboard(currentDashboard[0]);
    }
  };

  React.useEffect(() => {
    if (
      dashboards.length > 0 &&
      !dataFetchLoading &&
      !currentDashboard &&
      initialLoad
    ) {
      handleSetCurrentDashboard(userPreferences);
    }
  }, [dashboards, userPreferences, dataFetchLoading, initialLoad]);

  const handleWidgetViewOnPreference = (id: string, value: boolean) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};

    let expandWidgetData = defaultPreferences?.["expandWidgetStatus"]?.length
      ? [...defaultPreferences?.["expandWidgetStatus"]]
      : [];

    let dataIndex = expandWidgetData.length
      ? expandWidgetData.findIndex(
          (data: { id: string; value: boolean }) => data.id === id
        )
      : -1;

    if (dataIndex !== -1) {
      expandWidgetData[dataIndex] = { id: id, value: value };
    }

    const updatedExpandWidgetData: { id: string; value: boolean }[] =
      defaultPreferences?.["expandWidgetStatus"]?.length
        ? dataIndex === -1
          ? [...expandWidgetData, { id: id, value: value }]
          : expandWidgetData
        : [{ id: id, value: value }];
    saveUserPreferenceForWidgetSize({
      variables: {
        id:
          userPreferences && userPreferences.length > 0 && userPreferences[0].id
            ? userPreferences[0].id
            : null,
        modelName: "Preference",
        saveInput: {
          defaultPreferences: {
            ...defaultPreferences,
            expandWidgetStatus: updatedExpandWidgetData,
          },
          serviceName: "crm",
        },
      },
    });
  };

  return (
    <>
      {dataFetchLoading || !currentDashboard || !initialLoad ? (
        <>
          <GenericBackHeaderLoader />
          <DashboardSkeletonLoader itemCount={4} />
        </>
      ) : viewPermission ? (
        <>
          <DashboardScreen
            appName={appName}
            modelName={modelName}
            currentDashboard={currentDashboard}
            defaultDashboard={defaultDashboard}
            dashboards={dashboards}
            handleDashboardSelection={(item) => setCurrentDashboard(item)}
            menuVisible={menuVisible}
            setMenuVisible={(value) => setMenuVisible(value)}
            handlePreferencesChange={handlePreferencesChange}
            userPreferences={userPreferences}
            setDeleteModal={(value) =>
              setDeleteModal({ visible: value.visible, item: value.item })
            }
            handleWidgetViewOnPreference={handleWidgetViewOnPreference}
            user={user}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
          />
          {deleteModal.visible && (
            <>
              <DeleteModal
                id={"delete-dashboard-modal"}
                modalHeader={"Delete Dashboard"}
                modalMessage={"Are you sure you want to delete dashboard?"}
                leftButton={"Cancel"}
                rightButton={"Delete"}
                loading={deleteProcessing}
                onCancel={() => setDeleteModal({ visible: false, item: null })}
                onDelete={() => {
                  if (deleteModal?.item?.id) {
                    setDeleteProcessing(true);
                    deleteDashboard({
                      variables: {
                        id: deleteModal.item.id,
                        modelName: "Dashboard",
                        saveInput: {
                          recordStatus: "d",
                        },
                      },
                    });
                  } else {
                    Toast.error("Item not found");
                  }
                }}
                onOutsideClick={() =>
                  setDeleteModal({ visible: false, item: null })
                }
              />
              <Backdrop
                onClick={() => setDeleteModal({ visible: false, item: null })}
              />
            </>
          )}
        </>
      ) : (
        <NoViewPermission modelName="Dashboard" />
      )}
    </>
  );
});
