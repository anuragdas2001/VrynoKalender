import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
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
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { Dashboards } from "./Dashboards";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { observer } from "mobx-react-lite";

export type ConnectedDashboardsProps = {};

export const ConnectedDashboards = observer(({}: ConnectedDashboardsProps) => {
  const { t } = useTranslation(["common"]);
  const [dashboards, setDashboards] = React.useState<IDashboardDetails[]>([]);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { userPreferences, importUserPreferences } = generalModelStore;
  const [defaultDashboard, setDefaultDashboard] =
    React.useState<IUserPreference>();
  let { appName, modelName } = getAppPathParts();
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [viewPermission, setViewPermission] = React.useState<boolean>(true);
  const [dataFetchLoading, setDataFetchLoading] = React.useState<boolean>(true);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    item: any;
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
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
          setDashboards(responseOnCompletion.fetch.data);
          setItemsCount(responseOnCompletion.fetch.count);
          setViewPermission(true);
          getUserPreferences({
            variables: {
              modelName: AccountModels.Preference,
              fields: ["id", "serviceName", "defaultPreferences"],
              filters: [
                { name: "serviceName", operator: "eq", value: ["crm"] },
              ],
            },
          });
          return;
        } else if (
          responseOnCompletion?.fetch?.messageKey.includes("requires-view")
        ) {
          setViewPermission(false);
          setDataFetchLoading(false);
          return;
        }
        Toast.error("Unknown Error");
        setDataFetchLoading(false);
        return;
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
          setDefaultDashboard(responseOnCompletion.fetch.data[0]);
        }
        importUserPreferences(responseOnCompletion.fetch.data);
      }
      setDataFetchLoading(false);
    },
  });

  const [saveUserPreference] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        Toast.success(responseOnCompletion.save.message);
        getUserPreferences({
          variables: {
            modelName: AccountModels.Preference,
            fields: ["id", "serviceName", "defaultPreferences"],
            filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
          },
        });
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
      return;
    },
  });

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
        if (
          defaultDashboard?.defaultPreferences.dashboard ===
          responseOnCompletion.save.data.id
        ) {
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

  React.useEffect(() => {
    getDashboards({
      variables: {
        modelName: AppModels.Dashboard,
        fields: ["id", "name", "widgets"],
        filters: [],
      },
    });
  }, []);

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPageNumber(pageNumber);
    getDashboards({
      variables: {
        modelName: AppModels.Dashboard,
        fields: ["id", "name", "widgets"],
        filters: [],
        pageNumber: pageNumber,
      },
    });
  };

  return (
    <>
      {dataFetchLoading ? (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col  items-center justify-center"
        >
          <PageLoader />
        </div>
      ) : viewPermission ? (
        <>
          <Dashboards
            dashboards={dashboards}
            userPreferenceDefaultDashboard={defaultDashboard}
            handlePageChange={(pageNumber) => handlePageChange(pageNumber)}
            handlePreferencesChange={(item, value) =>
              handlePreferencesChange(item, value)
            }
            currentPageNumber={currentPageNumber}
            itemsCount={itemsCount}
            setDeleteModal={(value) =>
              setDeleteModal({ visible: value.visible, item: value.item })
            }
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
