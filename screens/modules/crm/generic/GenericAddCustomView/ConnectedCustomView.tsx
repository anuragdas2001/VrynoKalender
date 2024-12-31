import React, { useContext, useRef } from "react";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import {
  ICustomView,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { CustomViewTable } from "./CustomViewTable";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { setHeight } from "../../shared/utils/setHeight";
import { removeHeight } from "../../shared/utils/removeHeight";
import { AccountModels } from "../../../../../models/Accounts";
import {
  SaveData,
  SaveVars,
  SAVE_MUTATION,
} from "../../../../../graphql/mutations/saveMutation";
import { AppModels } from "../../../../../models/AppModels";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useTranslation } from "next-i18next";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { get } from "lodash";

export const ConnectedCustomView = observer(() => {
  const { t } = useTranslation(["common"]);
  const { modelName, appName } = getAppPathParts();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    userPreferences,
    importUserPreferences,
    setCurrentCustomViewId,
    setCurrentCustomViewFilter,
    setCurrentCustomViewById,
    importCustomViews,
    removeCustomView,
  } = generalModelStore;
  const heightRef = useRef(null);
  const sessionData = sessionStorage.getItem("ActiveModuleView");
  const [customViewList, setCustomViewList] = React.useState<ICustomView[]>([]);
  const [saveProcessing, setSaveProcessing] = React.useState<boolean>(false);
  const [dataProcessing, setDataProcessing] = React.useState<boolean>(true);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({ visible: false, id: null });

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
          importUserPreferences(responseOnCompletion.fetch.data);
        }
      }
      setDataProcessing(false);
    },
  });

  const [getModuleView] = useLazyQuery<FetchData<ICustomView>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data) {
          setCustomViewList(responseOnCompletion?.fetch?.data);
          importCustomViews(responseOnCompletion?.fetch?.data, modelName);
          getUserPreferences({
            variables: {
              modelName: AccountModels.Preference,
              fields: ["id", "serviceName", "defaultPreferences"],
              filters: [
                { name: "serviceName", operator: "eq", value: ["crm"] },
              ],
            },
          });
        }
      },
    }
  );

  const [saveUserPreference] = useMutation<
    SaveData<IUserPreference>,
    SaveVars<IUserPreference>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },

    onError: () => {
      importUserPreferences(userPreferences);
      setSaveProcessing(false);
      return;
    },
  });

  const [deleteCustomView] = useMutation<
    SaveData<ICustomView>,
    SaveVars<ICustomView>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onError: () => {
      setSaveProcessing(false);
    },
  });

  React.useEffect(() => {
    if (appName && modelName) {
      getModuleView({
        variables: {
          modelName: "ModuleView",
          fields: [
            "id",
            "name",
            "createdAt",
            "updatedAt",
            "updatedBy",
            "moduleName",
            "filters",
            "moduleFields",
            "recordsPerPage",
            "orderBy",
            "isShared",
            "config",
            "systemDefined",
            "expression",
          ],
          filters: [
            {
              operator: "eq",
              name: "createdBy",
              value: cookieUserStore.getUserId() || "",
            },
            {
              name: "moduleName",
              operator: "eq",
              value: modelName,
            },
          ],
        },
      });
    }
  }, [modelName, appName]);

  React.useEffect(() => {
    if (heightRef) {
      if (customViewList.length > 6) {
        setHeight(heightRef, 20);
      } else {
        removeHeight(heightRef);
      }
    }
  }, [customViewList]);

  const handleUserPreference = (
    status: boolean,
    customViewId: string,
    customView: ICustomView
  ) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    setSaveProcessing(true);
    saveUserPreference({
      variables: {
        id: updatedUserPreferences ? updatedUserPreferences.id : null,
        modelName: AppModels.Preference,
        saveInput: {
          serviceName: SupportedApps.crm,
          defaultPreferences: {
            ...defaultPreferences,
            [modelName]: status
              ? get(defaultPreferences, modelName, null)
                ? {
                    ...get(defaultPreferences, modelName, null),
                    moduleView: customViewId,
                    filters: customView.filters,
                    expression: customView.expression,
                  }
                : {
                    moduleView: customViewId,
                    filters: customView.filters,
                    expression: customView.expression,
                  }
              : get(defaultPreferences, modelName, null)
              ? {
                  ...get(defaultPreferences, modelName, null),
                  moduleView: null,
                  filters: [],
                  expression: null,
                }
              : { moduleView: null, filters: [], expression: null },
          },
        },
      },
    }).then((response) => {
      if (response?.data?.save?.messageKey?.includes("-success")) {
        importUserPreferences([response?.data.save.data]);
        if (sessionData) {
          const storedActiveView = JSON.parse(sessionData);
          sessionStorage.setItem(
            "ActiveModuleView",
            JSON.stringify({
              ...storedActiveView,
              [modelName]: {
                moduleView: status ? customViewId : null,
                filters: status ? customView.filters : [],
                expression: status ? customView.expression : null,
              },
            })
          );
        }
        setCurrentCustomViewId(status ? customViewId : "", modelName);
        setCurrentCustomViewFilter(
          status
            ? { filters: customView.filters, expression: customView.expression }
            : { filters: [], expression: null },
          modelName
        );
        setCurrentCustomViewById(status ? customViewId : "", modelName);
        Toast.success(response?.data?.save?.message);
        setSaveProcessing(false);
        return;
      }
      if (response?.data?.save?.messageKey) {
        importUserPreferences(userPreferences);
        Toast.error(`${response?.data.save.message}`);
        setSaveProcessing(false);
        return;
      }
      importUserPreferences(userPreferences);
      Toast.error(t("common:unknown-message"));
      setSaveProcessing(false);
    });
  };

  const handleDeleteCustomView = (id: string | null) => {
    setSaveProcessing(true);
    deleteCustomView({
      variables: {
        id: id,
        modelName: "ModuleView",
        saveInput: {
          recordStatus: "d",
        },
      },
    }).then((response) => {
      if (response?.data?.save?.messageKey?.includes("-success")) {
        removeCustomView(response?.data.save.data, modelName);
        setCustomViewList(
          customViewList.filter(
            (item) => item.id !== response?.data?.save?.data?.id
          )
        );
        if (sessionData) {
          const storedActiveView = JSON.parse(sessionData);
          if (genericModels[modelName]?.defaultCustomViewId ?? undefined === id)
            setCurrentCustomViewFilter(
              { filters: [], expression: null },
              modelName
            );
          if (
            storedActiveView?.[modelName] &&
            id === storedActiveView?.[modelName].moduleView
          ) {
            sessionStorage.setItem(
              "ActiveModuleView",
              JSON.stringify({
                ...storedActiveView,
                [modelName]: {
                  moduleView: null,
                  filters: [],
                  expression: null,
                },
              })
            );
          }
        }
        Toast.success(response?.data?.save?.message);
        setDeleteModal({ visible: false, id: null });
        setSaveProcessing(false);
        return;
      }
      if (response?.data?.save?.messageKey) {
        Toast.error(`${response?.data.save.message}`);
        setSaveProcessing(false);
        return;
      }
      Toast.error(t("common:unknown-message"));
      setSaveProcessing(false);
    });
  };

  return (
    <>
      <GenericBackHeader
        heading={"Custom View List"}
        addButtonInFlexCol={false}
      />
      <div className="p-6 ">
        <CustomViewTable
          appName={appName}
          modelName={modelName}
          dataProcessing={dataProcessing}
          customViewList={customViewList}
          userPreferences={userPreferences}
          saveProcessing={saveProcessing}
          handleUserPreference={(status, customViewId, customView) =>
            handleUserPreference(status, customViewId, customView)
          }
          handleDeleteCustomView={(item) =>
            setDeleteModal({ visible: true, id: item.id })
          }
        />
      </div>
      {deleteModal?.visible && (
        <>
          <DeleteModal
            id={deleteModal?.id}
            modalHeader={`Delete Custom View`}
            modalMessage={`Are you sure you want to delete this view?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={saveProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={() => handleDeleteCustomView(deleteModal.id)}
            onOutsideClick={() => setDeleteModal({ visible: false, id: null })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: null })}
          />
        </>
      )}
    </>
  );
});
