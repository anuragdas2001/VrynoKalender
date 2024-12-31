import React, { useContext } from "react";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ICustomView,
  IGenericConversionFormData,
  IKanbanViewData,
  IUserPreference,
  SupportedApps,
  SupportedDashboardViews,
  SupportedView,
} from "../../../../../models/shared";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { observer } from "mobx-react-lite";
import { AccountModels } from "../../../../../models/Accounts";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { GenericModelDashboard } from "./GenericModelDashboard";
import {
  IDeleteModalState,
  IGenericFormDetails,
} from "./exportGenericModelDashboardTypes";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { SendEmailModal } from "./SendEmailForm/SendEmailModal";
import GenericFormModalWrapper from "../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import { useRouter } from "next/router";
import { calculateCurrentCustomModuleViewFields } from "./ViewUtils/calculateCurrentCustomModuleViewFields";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  checkForAnyBackgroundProcessRunning,
  updateBackgroundProcessingInSession,
} from "../../../shared";
import { sliderWindowType } from "../../shared/components/SliderWindow";
import { SearchScreen } from "../../../../Shared/SearchScreen";
import { getNavigationLabel } from "../../shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import _, { get, startCase, toLower } from "lodash";
import { camelCase, capitalCase } from "change-case";
import { InstanceStoreContext } from "../../../../../stores/InstanceStore";
import { CustomViewFieldsModal } from "./CustomViewFieldsForm/CustomViewFieldsModal";
import { FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ExportPdfModal } from "./ExportPdfForm/ExportPdfModal";
import { IndexExpressionMapper } from "../GenericAddCustomView/customViewHelpers/customViewShared";
import { AddNewCustomViewModal } from "./AddNewCustomViewModal/AddNewCustomViewModal";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import { updateFilterExpression } from "./ViewUtils/updateFilterExpression";
import { generateBulkUpdateMutation } from "../../../../../graphql/mutations/moduleBulkUpdateMutation";
import { mutationNameGenerator } from "../../../../../graphql/helpers/mutationNameGenerator";
import { SupportedMutationNames } from "../../../../../graphql/helpers/graphQLShared";
import { useMassDeleteSessionId } from "../../../../layouts/GenericContainer";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { processModuleDataWithCustomFields } from "./ViewUtils/processModuleDatawithCustomFields";
import { UserStoreContext } from "../../../../../stores/UserStore";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { GenericConversionForm } from "./GenericConversionForm";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { MessageListContext } from "../../../../../pages/_app";

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}
const emptyModalValues = {
  visible: false,
  formDetails: {
    type: null,
    parentId: "",
    parentModelName: "",
    aliasName: "",
    id: "",
    modelName: "",
    appName: "",
  },
};
export type SampleModalType = {
  visible: boolean;
  item: Array<any>;
};

interface IGenericModelScreenProps {
  modelName: string;
  appName: SupportedApps;
  currentModule?: IModuleMetadata;
  dashboardView?: SupportedDashboardViews;
  backgroundProcessRunning?: boolean;
  setBackgroundProcessRunning?: (value: boolean) => void;
}

export const fetchActiveInactiveRecordsFilterValue = {
  operator: "in",
  name: "recordStatus",
  value: ["a", "i"],
};

export const GenericModelScreen = observer(
  ({
    appName,
    modelName,
    dashboardView = SupportedDashboardViews.Card,
    currentModule,
    backgroundProcessRunning,
    setBackgroundProcessRunning = () => {},
  }: IGenericModelScreenProps) => {
    const router = useRouter();
    const { t } = useTranslation(["common"]);
    const { navigations } = useContext(NavigationStoreContext);
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      userPreferences,
      allLayoutFetched,
      setCurrentCustomViewById,
      removeCustomView,
      addCustomView,
      setCurrentModulePageNumber,
      setItemsCount,
      setInitialModuleLoading,
      setCurrentPageDataLoading,
      setModuleViewPermission,
      setCurrentCustomViewId,
      setCurrentCustomViewFilter,
      setDefaultCustomViewId,
      setCustomViewPermission,
      setCurrentCustomView,
      importCustomViews,
      importUserPreferences,
      setCustomViewsLoaded,
      importModuleDataByCustomViewId,
      addModuleData,
      removeModuleDataById,
      setCurrentModulePageSize,
      resetCurrentModuleData,
      updateModuleData,
    } = generalModelStore;
    const { appMessage, instanceMessage } = useContext(MessageListContext);
    const cookieUser = cookieUserStore.getUserDetails();
    const { instances } = useContext(InstanceStoreContext);
    const subDomain = window.location.hostname.split(".")[0];
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    let fieldsList: ICustomField[] =
      genericModels[modelName]?.fieldsList &&
      genericModels[modelName]?.fieldsList?.length > 0
        ? getSortedFieldList(genericModels[modelName]?.fieldsList)
        : [];
    let currentPageNumber = genericModels[modelName]?.currentPageNumber ?? 1;
    const pageSize = genericModels[modelName]?.pageSize ?? 10;
    let moduleViewPermission =
      genericModels[modelName]?.moduleViewPermission === undefined
        ? true
        : genericModels[modelName]?.moduleViewPermission;
    let currentCustomViewId =
      genericModels[modelName]?.currentCustomViewId ?? "default-view";
    let defaultCustomViewId =
      genericModels[modelName]?.defaultCustomViewId ?? undefined;

    let itemsCount = genericModels[modelName]?.itemsCount
      ? genericModels[modelName]?.itemsCount[currentCustomViewId]
      : 0;
    let customModuleViewPermissions =
      genericModels[modelName]?.customViewPermission === undefined
        ? true
        : genericModels[modelName]?.customViewPermission;
    let currentCustomView = genericModels[modelName]?.currentCustomView;
    let customViews =
      genericModels[modelName]?.customViews?.length > 0
        ? genericModels[modelName]?.customViews
        : [];
    let customViewsLoaded = genericModels[modelName]?.customViewsLoaded;
    let allModuleDataByCustomViewID = genericModels[modelName]?.moduleData;
    let moduleData =
      allModuleDataByCustomViewID &&
      allModuleDataByCustomViewID[currentCustomViewId]
        ? allModuleDataByCustomViewID[currentCustomViewId]
            .slice(
              (currentPageNumber - 1) * pageSize,
              currentPageNumber * pageSize
            )
            .filter((data) => data)
        : [];

    let currentPageDataLoaded =
      genericModels[modelName]?.pageDataLoaded &&
      genericModels[modelName]?.pageDataLoaded[currentCustomViewId];

    const currentModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: currentModule?.name,
      currentModuleLabel: currentModule ? currentModule?.label.en : "",
      defaultLabel: modelName,
    });

    const salesOrderModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: "salesOrder",
      currentModuleLabel: "Sales Orders",
      defaultLabel: modelName,
    });

    const invoiceModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: "invoice",
      currentModuleLabel: "Invoices",
      defaultLabel: modelName,
    });

    const [customModuleViewLoading, setCustomModuleViewLoading] =
      React.useState<boolean>(false);
    const [openingRecordId, setOpeningRecordId] = React.useState<string | null>(
      null
    );
    const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
    const [selectedFilterFields, setSelectedFilterFields] = React.useState<
      any[]
    >([]);
    const [sortingFieldList, setSortingFieldList] = React.useState<
      { name: string; order: "ASC" | "DESC" | "None" }[]
    >([]);
    const [deleteModal, setDeleteModal] = React.useState<IDeleteModalState>({
      visible: false,
      id: "",
    });
    const [saveAsNewCustomViewVisible, setSaveAsNewCustomViewVisible] =
      React.useState<boolean>(false);
    const [customViewFieldsModal, setCustomViewFieldsModal] = React.useState<{
      visible: boolean;
      customView: ICustomView | null;
    }>();
    const [
      updatedNewFiltersForCurrentCustomView,
      setUpdatedNewFiltersForCurrentCustomView,
    ] = React.useState<
      {
        name: string | null;
        operator: string | null;
        value: any[] | null;
        logicalOperator: string | null;
      }[]
    >([]);
    const [newDataFoundWithSideNavFilters, setNewDataFoundWithSideNavFilters] =
      React.useState<boolean>(false);
    const [customViewFieldsFormLoading, setCustomViewFieldsFormLoading] =
      React.useState<boolean>(false);
    const [foundNewData, setFoundNewData] = React.useState<boolean>(false);
    const [customViewFiltersUpdateLoading, setCustomViewFiltersUpdateLoading] =
      React.useState<boolean>(false);
    const [deleteBulkItemsModal, setDeleteBulkItemsModal] = React.useState<{
      visible: boolean;
    }>({ visible: false });
    const [bulkDeleteProcessing, setBulkDeleteProcessing] =
      React.useState<boolean>(false);
    const [sendEmailModal, setSendEmailModal] = React.useState(false);
    const [activityFormModal, setActivityFormModal] =
      React.useState<IFormModalObject>(emptyModalValues);
    const activeModuleViewSessionData =
      sessionStorage.getItem("ActiveModuleView");
    const [localSearchModel, setLocalSearchModal] =
      React.useState<sliderWindowType>("-translate-y-full");
    const [exportPdfModal, setExportPdfModal] = React.useState<boolean>(false);
    const [searchFormClosed, setSearchFormClosed] =
      React.useState<boolean>(false);
    const [customViewsSideBarVisible, setCustomViewsSideBarVisible] =
      React.useState<boolean>(false);
    const [disableSearchButton, setDisableSearchButton] =
      React.useState<boolean>(true);
    const [sideNavigationDropdownValue, setSideNavigationDropdownValue] =
      React.useState<string>("customViews");
    const [KViewDataLoading, setKVDataLoading] = React.useState(true);
    const [KVData, setKVData] = React.useState<IKanbanViewData | null>(null);
    const [KVRecordData, setKVRecordData] = React.useState<any[]>([]);
    const [kanbanViewBulkDeleteRecords, setKanbanViewBulkDeleteRecords] =
      React.useState<string[] | null>(null);
    const { massDeleteSessionId, setMassDeleteSessionId } =
      useMassDeleteSessionId();
    const [kanbanViewPermission, setKanbanViewPermission] =
      React.useState(true);
    const [pageSizeLoader, setPageSizeLoader] = React.useState(false);
    const [displayConversionModal, setDisplayConversionModal] =
      React.useState<IGenericConversionFormData>({
        data: null,
        visible: false,
      });

    const updateModelFieldData = (field: string, value: any, id: string) => {
      try {
        const moduleDataToUpdate = moduleData.filter(
          (val) => val.id === id
        )?.[0];
        if (moduleDataToUpdate) {
          updateModuleData(
            { ...moduleDataToUpdate, [field]: value },
            modelName
          );
        }
      } catch (error) {
        console.error("Error while module updating values", error);
      }
    };

    //Kanban View - Fetch Data -> start
    const [getKanbanViewData] = useLazyQuery<
      FetchData<IKanbanViewData>,
      FetchVars
    >(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
    });

    React.useEffect(() => {
      if (localStorage.getItem(`quickFilter-${modelName}`)) return;
      setKVDataLoading(true);
      getKanbanViewData({
        variables: {
          modelName: "kanbanView",
          fields: [
            "name",
            "categorizeBy",
            "aggregateBy",
            "currencyType",
            "availableFields",
            "relatedModule",
          ],
          filters: [
            {
              name: "relatedModule",
              operator: "eq",
              value: [modelName],
            },
          ],
        },
      }).then((response) => {
        if (response?.data?.fetch?.messageKey.includes("-success")) {
          if (response?.data?.fetch.data?.length) {
            const data = response?.data?.fetch.data;
            setKVData({
              id: data[0].id,
              name: data[0].name,
              categorizeBy: data[0].categorizeBy,
              aggregateBy: data[0].aggregateBy,
              currencyType: data[0].currencyType,
              availableFields: data[0].availableFields,
              relatedModule: data[0].relatedModule,
            });
          } else {
            setKVData(null);
          }
        } else if (response?.data?.fetch.messageKey.includes("requires-view")) {
          setKanbanViewPermission(false);
          setKVData(null);
        } else {
          toast.error(response?.data?.fetch.message);
          setKVData(null);
        }
        setKVDataLoading(false);
        return;
      });
    }, [modelName, localStorage.getItem(`quickFilter-${modelName}`)]);
    //Kanban View - Fetch Data -> end

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
        if (
          responseOnCompletion?.fetch?.messageKey.includes("-success") &&
          responseOnCompletion?.fetch?.data &&
          responseOnCompletion?.fetch?.data.length > 0
        ) {
          let pageSizeFromPreferences =
            responseOnCompletion.fetch.data[0]?.defaultPreferences?.[modelName]
              ?.dashboardPageSize ?? pageSize;
          importUserPreferences(responseOnCompletion.fetch.data);
          if (
            responseOnCompletion.fetch.data[0]?.defaultPreferences?.[modelName]
              ?.dashboardPageSize
          ) {
            setCurrentModulePageSize(pageSizeFromPreferences, modelName);
          }
          if (
            responseOnCompletion.fetch.data[0]?.defaultPreferences &&
            responseOnCompletion.fetch.data[0]?.defaultPreferences?.[
              modelName
            ] &&
            responseOnCompletion.fetch.data[0].defaultPreferences?.[modelName]
              ?.moduleView
          ) {
            setDefaultCustomViewId(
              responseOnCompletion.fetch.data[0].defaultPreferences?.[modelName]
                .moduleView,
              modelName
            );
            setCurrentCustomViewFilter(
              {
                filters:
                  responseOnCompletion.fetch.data[0].defaultPreferences?.[
                    modelName
                  ].filters || [],
                expression:
                  responseOnCompletion.fetch.data[0].defaultPreferences?.[
                    modelName
                  ].expression || null,
              },
              modelName
            );
          }
          if (
            activeModuleViewSessionData &&
            JSON.parse(activeModuleViewSessionData)[modelName] &&
            JSON.parse(activeModuleViewSessionData)[modelName]?.moduleView
          ) {
            let activeModuleView = JSON.parse(activeModuleViewSessionData)[
              modelName
            ];
            updateBackgroundProcessingInSession("ModelData", true);
            setCurrentCustomViewId(activeModuleView?.moduleView, modelName);
            setCurrentCustomViewFilter(
              {
                filters: activeModuleView?.filters || [],
                expression: activeModuleView?.expression || null,
              },
              modelName
            );
            if (localStorage.getItem(`quickFilter-${modelName}`)) {
              updateBackgroundProcessingInSession("ModelData", false);
              return;
            }
            getModelData({
              variables: {
                customViewId: activeModuleView?.moduleView,
                modelName: modelName,
                fields: [],
                recordsPerPage: pageSizeFromPreferences,
                filters: [fetchActiveInactiveRecordsFilterValue],
              },
            });
          } else if (
            responseOnCompletion.fetch.data[0]?.defaultPreferences &&
            responseOnCompletion.fetch.data[0]?.defaultPreferences?.[
              modelName
            ] &&
            responseOnCompletion.fetch.data[0].defaultPreferences?.[modelName]
              ?.moduleView
          ) {
            updateBackgroundProcessingInSession("ModelData", true);
            setCurrentCustomViewId(
              responseOnCompletion.fetch.data[0].defaultPreferences?.[modelName]
                .moduleView,
              modelName
            );
            setCurrentCustomViewFilter(
              {
                filters:
                  responseOnCompletion.fetch.data[0].defaultPreferences?.[
                    modelName
                  ].filters || [],
                expression:
                  responseOnCompletion.fetch.data[0].defaultPreferences?.[
                    modelName
                  ].expression || null,
              },
              modelName
            );
            if (localStorage.getItem(`quickFilter-${modelName}`)) {
              updateBackgroundProcessingInSession("ModelData", false);
              return;
            }
            getModelData({
              variables: {
                customViewId:
                  responseOnCompletion.fetch.data[0].defaultPreferences?.[
                    modelName
                  ].moduleView,
                modelName: modelName,
                fields: [],
                recordsPerPage: pageSizeFromPreferences,
                filters: [fetchActiveInactiveRecordsFilterValue],
              },
            });
          } else {
            updateBackgroundProcessingInSession("ModelData", true);
            setCurrentCustomViewId("default-view", modelName);
            setCurrentCustomViewFilter(
              { filters: [], expression: null },
              modelName
            );
            if (localStorage.getItem(`quickFilter-${modelName}`)) {
              updateBackgroundProcessingInSession("ModelData", false);
              return;
            }
            getModelData({
              variables: {
                customViewId: "default-view",
                modelName: modelName,
                fields: [],
                recordsPerPage: pageSizeFromPreferences,
                filters: [fetchActiveInactiveRecordsFilterValue],
              },
            });
          }
        } else {
          if (
            activeModuleViewSessionData &&
            JSON.parse(activeModuleViewSessionData)[modelName] &&
            JSON.parse(activeModuleViewSessionData)[modelName]?.moduleView
          ) {
            let activeModuleView = JSON.parse(activeModuleViewSessionData)[
              modelName
            ];
            updateBackgroundProcessingInSession("ModelData", true);
            setCurrentCustomViewId(activeModuleView?.moduleView, modelName);
            setCurrentCustomViewFilter(
              {
                filters: activeModuleView?.filters || [],
                expression: activeModuleView?.expression || null,
              },
              modelName
            );
            if (localStorage.getItem(`quickFilter-${modelName}`)) {
              updateBackgroundProcessingInSession("ModelData", false);
              return;
            }
            getModelData({
              variables: {
                customViewId: activeModuleView?.moduleView,
                modelName: modelName,
                fields: [],
                recordsPerPage: pageSize,
                filters: [fetchActiveInactiveRecordsFilterValue],
              },
            });
          } else {
            updateBackgroundProcessingInSession("ModelData", true);
            setCurrentCustomViewId("default-view", modelName);
            setCurrentCustomViewFilter(
              { filters: [], expression: null },
              modelName
            );
            if (localStorage.getItem(`quickFilter-${modelName}`)) {
              updateBackgroundProcessingInSession("ModelData", false);
              return;
            }
            getModelData({
              variables: {
                customViewId: "default-view",
                modelName: modelName,
                fields: [],
                recordsPerPage: pageSize,
                filters: [fetchActiveInactiveRecordsFilterValue],
              },
            });
          }
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
    });

    const handleChangeRecordPerPage = (value: number) => {
      const updatedUserPreferences =
        userPreferences && userPreferences.length > 0
          ? userPreferences[0]
          : null;
      const defaultPreferences = updatedUserPreferences
        ? { ...updatedUserPreferences.defaultPreferences }
        : {};
      setPageSizeLoader(true);
      saveUserPreference({
        variables: {
          id: updatedUserPreferences ? updatedUserPreferences.id : null,
          modelName: AccountModels.Preference,
          saveInput: {
            defaultPreferences: {
              ...defaultPreferences,
              [modelName]: get(defaultPreferences, modelName, null)
                ? {
                    ...get(defaultPreferences, modelName),
                    dashboardPageSize: value,
                  }
                : {
                    dashboardPageSize: value,
                  },
            },
            serviceName: SupportedApps.crm,
          },
        },
      }).then(async (response) => {
        if (response?.data?.save?.messageKey.includes("success")) {
          importUserPreferences([response?.data?.save?.data]);
          setCurrentModulePageSize(value, modelName);
          resetCurrentModuleData(modelName);
          setCurrentModulePageNumber(1, modelName);
          if (updatedNewFiltersForCurrentCustomView?.length) {
            await fetchTemparoryFilterData(
              updatedNewFiltersForCurrentCustomView,
              updatedNewFiltersForCurrentCustomView?.length === 0
                ? 1
                : currentPageNumber,
              sortingFieldList
            );
            setPageSizeLoader(false);
          } else {
            await getModelData({
              variables: {
                customViewId: currentCustomView?.id ?? "default-view",
                modelName: modelName,
                fields: [],
                filters: [fetchActiveInactiveRecordsFilterValue],
                recordsPerPage: value,
              },
            });
            setPageSizeLoader(false);
          }
        } else {
          toast.error(
            response?.data?.save.message || "Error while saving preference"
          );
          setPageSizeLoader(false);
        }
      });
    };

    const [saveCustomView] = useMutation<
      SaveData<ICustomView>,
      SaveVars<ICustomView>
    >(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
      onCompleted: async (data) => {
        if (data.save.messageKey.includes("success")) {
          handleDashboardChange(data.save.data);
          setCurrentModulePageNumber(1, modelName);
          addCustomView(data.save.data, modelName);
          updateBackgroundProcessingInSession("ModelData", true);
          setCurrentCustomViewId(data.save.data?.id, modelName);
          setCurrentCustomView(data.save.data, modelName);
          await getModelData({
            variables: {
              customViewId: data.save.data?.id,
              modelName: modelName,
              fields: [],
              recordsPerPage: pageSize,
              filters: [fetchActiveInactiveRecordsFilterValue],
            },
          })
            .then((response) => {
              getModelDataAfterProcessing(response?.data);
              updateBackgroundProcessingInSession("ModelData", false);
            })
            .catch((error) =>
              updateBackgroundProcessingInSession("ModelData", false)
            );
          setCustomViewFieldsModal({ visible: false, customView: null });
          setCustomViewFieldsFormLoading(false);
          setCustomViewFiltersUpdateLoading(false);
          if (saveAsNewCustomViewVisible) {
            Toast.success("Custom View created successfully");
            setSaveAsNewCustomViewVisible(false);
          } else {
            Toast.success("Custom view updated successfully");
          }
          setSelectedFilterFields([]);
          setSortingFieldList([]);
          setNewDataFoundWithSideNavFilters(false);
          setUpdatedNewFiltersForCurrentCustomView([]);
          return;
        }
        if (data.save.messageKey) {
          Toast.error(data.save.message);
          setCustomViewFieldsFormLoading(false);
          setCustomViewFiltersUpdateLoading(false);
          setNewDataFoundWithSideNavFilters(false);
          return;
        }
        setCustomViewFieldsFormLoading(false);
        setCustomViewFiltersUpdateLoading(false);
        setNewDataFoundWithSideNavFilters(false);
        Toast.error(t("common:unknown-message"));
      },
    });

    const getModelDataAfterProcessing = (responseOnCompletion: any) => {
      if (responseOnCompletion?.fetch?.data) {
        const updatedModelData = processModuleDataWithCustomFields(
          responseOnCompletion.fetch.data
        );
        setItemsCount(
          responseOnCompletion.fetch.count,
          modelName,
          currentCustomViewId
        );
        setInitialModuleLoading(true, modelName);
        setModuleViewPermission(true, modelName);
        setCurrentPageDataLoading(
          true,
          modelName,
          currentPageNumber,
          currentCustomViewId
        );
        importModuleDataByCustomViewId(
          updatedModelData,
          currentPageNumber ?? 1,
          modelName,
          responseOnCompletion.fetch.count,
          currentCustomViewId
        );
        updateBackgroundProcessingInSession("ModelData", false);
        setCustomViewFiltersUpdateLoading(false);
        setFoundNewData(true);
        setDataLoading(false);
        return;
      } else if (responseOnCompletion?.fetch.messageKey.includes("view")) {
        Toast.error(responseOnCompletion?.fetch.message);
        setModuleViewPermission(false, modelName);
        updateBackgroundProcessingInSession("ModelData", false);
        setNewDataFoundWithSideNavFilters(false);
        setCustomViewFiltersUpdateLoading(false);
        setFoundNewData(false);
        setDataLoading(false);
        return;
      } else {
        Toast.error(responseOnCompletion?.fetch.message);
        updateBackgroundProcessingInSession("ModelData", false);
        setCustomViewFiltersUpdateLoading(false);
        setNewDataFoundWithSideNavFilters(false);
        setFoundNewData(false);
        setDataLoading(false);
        return;
      }
    };

    const [getModelData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        getModelDataAfterProcessing(responseOnCompletion);
        pageSizeLoader && setPageSizeLoader(false);
      },
    });

    const [getTemporaryFilterData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      nextFetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        getModelDataAfterProcessing(responseOnCompletion);
      },
    });

    const [serverDeleteData] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const [bulkUpdateDelete] = useMutation(
      generateBulkUpdateMutation(modelName),
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: appName,
          },
        },
      }
    );

    const [getCustomViewList] = useLazyQuery<FetchData<ICustomView>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: appName,
          },
        },
        onCompleted: (responseOnCompletion) => {
          if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
            importCustomViews(responseOnCompletion.fetch.data, modelName);
            setCustomViewPermission(true, modelName);
            updateBackgroundProcessingInSession("CustomViews", false);
            getUserPreferences({
              variables: {
                modelName: AccountModels.Preference,
                fields: ["id", "serviceName", "defaultPreferences"],
                filters: [
                  { name: "serviceName", operator: "eq", value: [appName] },
                ],
              },
            });
            setCustomModuleViewLoading(false);
            setCustomViewsLoaded(true, modelName);
            return;
          } else if (responseOnCompletion?.fetch?.messageKey.includes("view")) {
            updateBackgroundProcessingInSession("CustomViews", false);
            setCustomViewPermission(false, modelName);
            setCustomModuleViewLoading(false);
            getUserPreferences({
              variables: {
                modelName: AccountModels.Preference,
                fields: ["id", "serviceName", "defaultPreferences"],
                filters: [
                  { name: "serviceName", operator: "eq", value: [appName] },
                ],
              },
            });
            setCustomViewsLoaded(true, modelName);
            return;
          }
          setCustomModuleViewLoading(false);
          updateBackgroundProcessingInSession("CustomViews", false);
        },
      }
    );

    React.useEffect(() => {
      if (!appName || !modelName) return;
      setCustomModuleViewLoading(true);
      setSelectedItems([]);
      setCurrentModulePageNumber(1, modelName);
      updateBackgroundProcessingInSession("CustomViews", true);
      getCustomViewList({
        variables: {
          modelName: "ModuleView",
          fields: [
            "id",
            "name",
            "moduleName",
            "filters",
            "moduleFields",
            "recordsPerPage",
            "orderBy",
            "isShared",
            "config",
            "expression",
            "createdBy",
          ],
          filters: [
            {
              operator: "eq",
              name: "moduleName",
              value: modelName || "",
            },
          ],
        },
      });
    }, [modelName, appName]);

    React.useEffect(() => {
      if (currentCustomViewId && customViews && customViews.length > 0) {
        let currentCustomModuleView = customViews.filter(
          (view) => view.id === currentCustomViewId
        );
        currentCustomModuleView.length > 0 &&
          setCurrentCustomView(currentCustomModuleView[0], modelName);
      }
    }, [currentCustomViewId, customViews]);

    const fetchTemparoryFilterData = async (
      selectedFilterFields: {
        name: string | null;
        operator: string | null;
        value: any[] | null;
        logicalOperator: string | null;
      }[],
      currentPageNumber: number,
      sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[],
      calledFrom?: "localStorage" | "web"
    ) => {
      let invalidFilter = false;
      let updatedExpression = currentCustomView?.expression ?? "";
      selectedFilterFields.forEach(
        (filter) => (updatedExpression = "( " + updatedExpression)
      );

      selectedFilterFields?.forEach((filter) =>
        filter.operator === null ? (invalidFilter = true) : null
      );

      if (invalidFilter) {
        setCustomViewFiltersUpdateLoading(false);
        setNewDataFoundWithSideNavFilters(false);
        pageSizeLoader && setPageSizeLoader(false);
        if (calledFrom === "localStorage") return;
        return toast.error("Invalid filter, value cannot be empty");
      }
      setNewDataFoundWithSideNavFilters(true);
      selectedFilterFields.forEach(
        (filter, index) =>
          (updatedExpression =
            updatedExpression +
            ((_.get(currentCustomView?.filters, "length", 0) > 0 ||
              updatedExpression !== "") &&
            (_.get(currentCustomView?.filters, "length", 0) > 0 || index !== 0)
              ? ` and ${
                  IndexExpressionMapper[
                    (currentCustomView?.filters?.length ?? 0) + index + 1
                  ]
                } ) `
              : `${
                  IndexExpressionMapper[
                    (currentCustomView?.filters?.length ?? 0) + index + 1
                  ]
                } ) `))
      );
      let currentCustomViewFilters = currentCustomView
        ? currentCustomView?.filters?.map(
            (
              view: {
                name: string | null;
                operator: string | null;
                value: any[] | null;
                logicalOperator: string | null;
              },
              index: number
            ) => {
              if (index === currentCustomView?.filters?.length - 1) {
                return { ...view, logicalOperator: "AND" };
              } else {
                return view;
              }
            }
          )
        : [];
      setUpdatedNewFiltersForCurrentCustomView(
        currentCustomView && selectedFilterFields?.length > 0
          ? [...currentCustomViewFilters, ...selectedFilterFields]
          : [...selectedFilterFields]
      );
      await getTemporaryFilterData({
        variables: {
          modelName: modelName,
          fields: [
            ...getVisibleFieldsArray(fieldsList),
            "isSample",
            "recordStatus",
          ],
          filters: currentCustomView
            ? [
                ...currentCustomView.filters,
                ...selectedFilterFields,
                fetchActiveInactiveRecordsFilterValue,
              ]
            : [...selectedFilterFields, fetchActiveInactiveRecordsFilterValue],
          expression: updatedExpression,
          pageNumber: currentPageNumber,
          orderBy: sortingFieldList?.map((fieldOrder) => {
            return { name: fieldOrder.name, order: [fieldOrder.order] };
          }),
          recordsPerPage: pageSize,
        },
      }).then((response) => {
        getModelDataAfterProcessing(response?.data);
      });
    };

    const handleDashboardChange = (item: ICustomView | undefined) => {
      if (currentCustomView?.id !== item?.id) {
        sessionStorage.setItem(
          "ActiveModuleView",
          activeModuleViewSessionData
            ? JSON.stringify({
                ...JSON.parse(activeModuleViewSessionData),
                [modelName]: {
                  moduleView: item?.id,
                  filters: item?.filters || [],
                  expression: item?.expression || null,
                },
              })
            : JSON.stringify({
                [modelName]: {
                  moduleView: item?.id,
                  filters: item?.filters || [],
                  expression: item?.expression || null,
                },
              })
        );
        setCurrentCustomView(item, modelName);
        setCurrentCustomViewId(item?.id, modelName);
        setCurrentCustomViewFilter(
          {
            filters: item?.filters || [],
            expression: item?.expression || null,
          },
          modelName
        );
        setCurrentModulePageNumber(1, modelName);
        updateBackgroundProcessingInSession("ModelData", true);
        getModelData({
          variables: {
            customViewId: item?.id,
            modelName: modelName,
            fields: [],
            recordsPerPage: pageSize,
            filters: [fetchActiveInactiveRecordsFilterValue],
          },
        });
        setSelectedFilterFields([]);
        setSortingFieldList([]);
      }
    };

    const handlePageChange = (pageNumber: number) => {
      updateBackgroundProcessingInSession("ModelData", true);
      if (
        updatedNewFiltersForCurrentCustomView?.length > 0 ||
        sortingFieldList?.length > 0
      ) {
        setCurrentModulePageNumber(pageNumber, modelName);
        fetchTemparoryFilterData(
          updatedNewFiltersForCurrentCustomView,
          pageNumber,
          sortingFieldList
        );
      } else {
        getModelData({
          variables: {
            customViewId: currentCustomView?.id,
            modelName: modelName,
            fields: [],
            filters: [fetchActiveInactiveRecordsFilterValue],
            pageNumber: pageNumber,
            recordsPerPage: pageSize,
          },
        });
        setCurrentModulePageNumber(pageNumber, modelName);
      }
      updateBackgroundProcessingInSession("ModelData", false);
    };

    const handleDelete = (id: string) => {
      moduleData.length === 1
        ? currentPageNumber === 1
          ? setCurrentModulePageNumber(1, modelName)
          : setCurrentModulePageNumber(currentPageNumber - 1, modelName)
        : setCurrentModulePageNumber(currentPageNumber, modelName);
      if (moduleData.length === 1) {
        getModelData({
          variables: {
            customViewId: currentCustomView?.id,
            modelName: modelName,
            fields: [],
            filters: [fetchActiveInactiveRecordsFilterValue],
            pageNumber: currentPageNumber === 1 ? 1 : currentPageNumber - 1,
            recordsPerPage: pageSize,
          },
        });
      }
      removeModuleDataById(id, modelName);
      updateBackgroundProcessingInSession("ModelData", false);
    };

    const [dataLoading, setDataLoading] = React.useState(false);

    const handleBulkDelete = (deletedItems: string[]) => {
      currentPageNumber === 1
        ? setCurrentModulePageNumber(1, modelName)
        : setCurrentModulePageNumber(currentPageNumber - 1, modelName);
      updateBackgroundProcessingInSession("ModelData", true);
      getModelData({
        variables: {
          customViewId: currentCustomView?.id,
          modelName: modelName,
          fields: [],
          filters: [fetchActiveInactiveRecordsFilterValue],
          pageNumber: currentPageNumber === 1 ? 1 : currentPageNumber - 1,
          recordsPerPage: pageSize,
        },
      });
    };

    React.useEffect(() => {
      if (massDeleteSessionId?.[modelName]?.length) {
        const idList = massDeleteSessionId?.[modelName]?.map((id) => id);
        setKanbanViewBulkDeleteRecords(idList);
        setDataLoading(true);
        handleBulkDelete(idList);
        setMassDeleteSessionId({ ...massDeleteSessionId, [modelName]: [] });
      }
    }, [JSON.stringify(massDeleteSessionId?.[modelName] || {})]);

    const handleNewAddedRecord = (data: any) => {
      addModuleData(data, modelName);
    };

    const handleSaveCurrentDashboardView = (
      currentView: React.SetStateAction<SupportedDashboardViews>
    ) => {
      const findInstanceIndex = instances?.findIndex(
        (instance) => instance?.subdomain === subDomain
      );
      if (findInstanceIndex === -1 || !cookieUser?.id || !modelName) {
        return;
      }

      let currentDashboardView =
        localStorage.getItem(
          "currentDashboardViewPerModulePerInstancePerUser"
        ) ?? {};
      let updatedCurrentDashboardView =
        currentDashboardView && Object.keys(currentDashboardView)?.length > 0
          ? {
              ...JSON.parse(currentDashboardView.toString()),
            }
          : {};
      updatedCurrentDashboardView[cookieUser?.id] = {
        ...updatedCurrentDashboardView[cookieUser?.id],
      };

      updatedCurrentDashboardView[cookieUser?.id][
        instances[findInstanceIndex].id
      ] = {
        ...updatedCurrentDashboardView[cookieUser?.id][
          instances[findInstanceIndex].id
        ],
      };
      updatedCurrentDashboardView[cookieUser?.id][
        instances[findInstanceIndex].id
      ][modelName] = currentView.toString().toLocaleLowerCase();

      localStorage.setItem(
        "currentDashboardViewPerModulePerInstancePerUser",
        JSON.stringify(updatedCurrentDashboardView)
      );
    };

    const handleCustomViewFieldsUpdate = (
      customView: ICustomView | null,
      values: FormikValues
    ) => {
      try {
        setCustomViewFieldsFormLoading(true);
        saveCustomView({
          variables: {
            id: customView?.id,
            modelName: "ModuleView",
            saveInput: {
              moduleName: modelName,
              name: customView?.name,
              filters: customView?.filters,
              moduleFields: [
                ...values["fieldList"]
                  ?.map((value: string) => {
                    const valueIndex = fieldsList.findIndex(
                      (field) => field.name === value
                    );
                    if (valueIndex !== -1)
                      return fieldsList[valueIndex].systemDefined
                        ? fieldsList[valueIndex].name
                        : `fields.${fieldsList[valueIndex].name}`;
                    else return null;
                  })
                  .filter((field: string | null) => field),
                "isSample",
              ],
              orderBy: customView?.orderBy,
              isShared: false,
              recordsPerPage: pageSize,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    const handleSelectedFilterFields = (field: any) => {
      const findIndex = selectedFilterFields.findIndex(
        (selectedFilterField) => selectedFilterField.name === field.name
      );
      if (findIndex === -1) {
        setSelectedFilterFields([...selectedFilterFields, field]);
        return;
      } else {
        let updatedSelectedFilterFields = [...selectedFilterFields];
        updatedSelectedFilterFields = [
          ...updatedSelectedFilterFields?.filter(
            (selectedFilterField) => selectedFilterField.name !== field.name
          ),
        ];
        if ([...updatedSelectedFilterFields]?.length <= 0) {
          localStorage.removeItem(`quickFilter-${modelName}`);
          setSelectedFilterFields([]);
          handleApplyTemparoryFilter([]);
          setNewDataFoundWithSideNavFilters(false);
        }
        setSelectedFilterFields([...updatedSelectedFilterFields]);
      }
    };

    const handleApplyTemparoryFilter = async (
      recievedSelectedFilterFields: {
        name: string | null;
        operator: string | null;
        value: any[] | null;
        logicalOperator: string | null;
      }[],
      sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[],
      calledFrom?: "localStorage" | "web"
    ) => {
      try {
        setCustomViewFiltersUpdateLoading(true);
        if (
          recievedSelectedFilterFields?.length === 0 &&
          sortingFieldList?.length === 0
        ) {
          getModelData({
            variables: {
              customViewId: currentCustomView?.id,
              modelName: modelName,
              fields: [],
              filters: [fetchActiveInactiveRecordsFilterValue],
              pageNumber: 1,
              recordsPerPage: pageSize,
            },
          });
          setSelectedFilterFields([]);
          setUpdatedNewFiltersForCurrentCustomView([]);
          setNewDataFoundWithSideNavFilters(false);
          setCurrentModulePageNumber(1, modelName);
          return;
        }
        fetchTemparoryFilterData(
          recievedSelectedFilterFields,
          recievedSelectedFilterFields?.length === 0 ? 1 : currentPageNumber,
          sortingFieldList,
          calledFrom
        );
        setCurrentModulePageNumber(
          recievedSelectedFilterFields?.length === 0 ? 1 : currentPageNumber,
          modelName
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleAddFiltersToCurrentCustomView = async () => {
      try {
        let updatedExpression = currentCustomView?.expression ?? "";
        updatedExpression = updateFilterExpression(
          selectedFilterFields,
          updatedExpression,
          currentCustomView?.filters
        );
        setCustomViewFieldsFormLoading(true);
        setCustomViewFiltersUpdateLoading(true);
        await saveCustomView({
          variables: {
            id: currentCustomView?.id,
            modelName: "ModuleView",
            saveInput: {
              moduleName: modelName,
              name: currentCustomView?.name,
              filters:
                updatedNewFiltersForCurrentCustomView?.length === 0
                  ? currentCustomView?.filters
                  : updatedNewFiltersForCurrentCustomView,
              moduleFields: currentCustomView?.moduleFields,
              orderBy: [
                ...currentCustomView?.orderBy,
                ...sortingFieldList?.map((fieldOrder) => {
                  return { name: fieldOrder.name, order: [fieldOrder.order] };
                }),
              ],
              expression: updatedExpression,
              isShared: false,
              recordsPerPage: pageSize,
            },
          },
        });

        return;
      } catch (error) {
        console.error(error);
      }
    };

    const handleAddFiltersToNewCustomView = async (values: FormikValues) => {
      try {
        let updatedExpression = currentCustomView?.expression ?? "";
        updatedExpression = updateFilterExpression(
          selectedFilterFields,
          updatedExpression,
          currentCustomView?.filters
        );
        setCustomViewFieldsFormLoading(true);
        setCustomViewFiltersUpdateLoading(true);
        await saveCustomView({
          variables: {
            id: null,
            modelName: "ModuleView",
            saveInput: {
              moduleName: modelName,
              name: values?.name,
              filters:
                updatedNewFiltersForCurrentCustomView?.length === 0
                  ? currentCustomView?.filters
                  : updatedNewFiltersForCurrentCustomView,
              moduleFields: currentCustomView?.moduleFields,
              orderBy: [
                ...currentCustomView?.orderBy,
                ...sortingFieldList?.map((fieldOrder) => {
                  return { name: fieldOrder.name, order: [fieldOrder.order] };
                }),
              ],
              expression: updatedExpression,
              isShared: false,
              recordsPerPage: pageSize,
            },
          },
        });
        return;
      } catch (error) {
        console.error(error);
      }
    };

    const handleSorting = async (value: {
      name: string;
      order: "ASC" | "DESC" | "None";
    }) => {
      const findIndex = sortingFieldList?.findIndex(
        (field) => field.name === value.name
      );
      if (findIndex !== -1) {
        let updatedSortingFieldList = [...sortingFieldList];
        updatedSortingFieldList[findIndex] = value;
        await handleApplyTemparoryFilter(
          updatedNewFiltersForCurrentCustomView,
          [...updatedSortingFieldList]
        );
        setSortingFieldList([...updatedSortingFieldList]);
      } else {
        await handleApplyTemparoryFilter(
          updatedNewFiltersForCurrentCustomView,
          [...sortingFieldList, value]
        );
        setSortingFieldList([...sortingFieldList, value]);
      }
    };

    React.useEffect(() => {
      setBackgroundProcessRunning(checkForAnyBackgroundProcessRunning());
    }, [
      JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }"),
    ]);

    React.useEffect(() => {
      setTimeout(() => setBackgroundProcessRunning(false), 10000);
    }, []);

    React.useEffect(() => {
      if (!localStorage.getItem(`quickFilter-${modelName}`)) {
        for (let i = 0; i <= localStorage.length; i++) {
          if (localStorage.key(i)?.includes("quickFilter"))
            localStorage.removeItem(localStorage.key(i) ?? "");
        }
        setSelectedFilterFields([]);
      }
      setSortingFieldList([]);
    }, [currentCustomView, modelName]);

    if (fieldsList.length <= 0 || !currentModule) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    return moduleViewPermission ? (
      <>
        <GenericModelDashboard
          backgroundProcessRunning={backgroundProcessRunning}
          appName={appName}
          modelName={modelName}
          currentModuleLabel={currentModuleLabel}
          fieldsList={fieldsList}
          sortingFieldList={sortingFieldList}
          setSortingFieldList={setSortingFieldList}
          customModuleViewLoading={
            customModuleViewLoading && !customViewsLoaded
          }
          newDataFoundWithSideNavFilters={newDataFoundWithSideNavFilters}
          foundNewData={foundNewData}
          openingRecordId={openingRecordId}
          setOpeningRecordId={setOpeningRecordId}
          setFoundNewData={setFoundNewData}
          customModuleViewFieldsList={calculateCurrentCustomModuleViewFields(
            fieldsList,
            currentCustomViewId,
            customViews
          )}
          user={user}
          userPreferences={userPreferences}
          appMessage={appMessage}
          instanceMessage={instanceMessage}
          importUserPreferences={importUserPreferences}
          setCurrentCustomViewId={setCurrentCustomViewId}
          setCurrentCustomViewFilter={setCurrentCustomViewFilter}
          setCurrentCustomViewById={setCurrentCustomViewById}
          setDefaultCustomViewId={setDefaultCustomViewId}
          removeCustomView={removeCustomView}
          customModuleViewPermissions={customModuleViewPermissions}
          customModuleViewList={customViews}
          modelDataLoading={
            dataLoading
              ? true
              : currentPageDataLoaded
              ? !currentPageDataLoaded[currentPageNumber]
              : true
          }
          modelData={moduleData}
          currentModule={currentModule}
          itemsCount={itemsCount}
          genericModels={genericModels}
          instances={instances}
          currentDashboardView={
            capitalCase(dashboardView) as SupportedDashboardViews
          }
          defaultCustomViewId={defaultCustomViewId}
          currentModuleCustomView={currentCustomView}
          selectedItems={selectedItems}
          currentPageNumber={currentPageNumber}
          customViewsSideBarVisible={customViewsSideBarVisible}
          disableSearchButton={disableSearchButton}
          customViewFiltersUpdateLoading={customViewFiltersUpdateLoading}
          setCustomViewsSideBarVisible={(value) =>
            setCustomViewsSideBarVisible(value)
          }
          deleteModalVisible={
            deleteModal.visible || deleteBulkItemsModal.visible
          }
          sideNavigationDropdownValue={sideNavigationDropdownValue}
          setSideNavigationDropdownValue={(value) =>
            setSideNavigationDropdownValue(value)
          }
          onPageChange={(pageNumber) => handlePageChange(pageNumber)}
          setCurrentDashbaordView={(value) =>
            handleSaveCurrentDashboardView(value)
          }
          setCurrentModuleCustomView={(item) => {
            setCurrentModulePageNumber(1, modelName);
            handleDashboardChange(item);
            setNewDataFoundWithSideNavFilters(false);
          }}
          setSelectedItems={(items) => setSelectedItems(items)}
          setDeleteModal={(value) => setDeleteModal(value)}
          setDeleteBulkItemsModal={(value) => setDeleteBulkItemsModal(value)}
          setSendEmailModal={(value) => setSendEmailModal(value)}
          handleNewAddedRecord={(data) => {
            handleNewAddedRecord(data);
          }}
          setActivityFormModal={(value) => setActivityFormModal(value)}
          handleCustomViewFieldChange={(customView) =>
            setCustomViewFieldsModal({ visible: true, customView })
          }
          handleSearchedSelectedItem={(items) => {
            router?.replace(
              `${appName}/${modelName}/${SupportedView.Detail}/${items[0].rowId}`
            );
          }}
          setLocalSearchModal={(value) => {
            setLocalSearchModal(value);
            setSearchFormClosed(false);
          }}
          KVData={KVData}
          kanbanViewPermission={kanbanViewPermission}
          KVRecordData={KVRecordData}
          setKVRecordData={(data: any[]) => setKVRecordData(data)}
          setKVData={(value: IKanbanViewData) => setKVData(value)}
          KViewDataLoading={KViewDataLoading}
          updatedNewFiltersForCurrentCustomView={
            updatedNewFiltersForCurrentCustomView
          }
          setExportPdfModal={(value) => setExportPdfModal(value)}
          selectedFilterFields={selectedFilterFields}
          onSelectFilterField={handleSelectedFilterFields}
          handleApplyTemparoryFilter={(
            selectedFilterFields,
            sortFieldList,
            calledFrom
          ) => {
            handleApplyTemparoryFilter(
              selectedFilterFields,
              sortFieldList ? sortFieldList : sortingFieldList,
              calledFrom
            );
          }}
          handleAddFiltersToCurrentCustomView={
            handleAddFiltersToCurrentCustomView
          }
          handleAddFiltersToNewCustomView={() =>
            setSaveAsNewCustomViewVisible(true)
          }
          kanbanViewBulkDeleteRecords={kanbanViewBulkDeleteRecords}
          setKanbanViewBulkDeleteRecords={(value: any[] | null) =>
            setKanbanViewBulkDeleteRecords(value)
          }
          handleSorting={handleSorting}
          setSelectedFilterFields={setSelectedFilterFields}
          handleChangeRecordPerPage={handleChangeRecordPerPage}
          pageSize={pageSize}
          pageSizeLoader={pageSizeLoader}
          updateModelFieldData={updateModelFieldData}
          salesOrderModuleLabel={salesOrderModuleLabel}
          invoiceModuleLabel={invoiceModuleLabel}
          setDisplayConversionModal={(value: IGenericConversionFormData) =>
            setDisplayConversionModal(value)
          }
        />
        {customViewFiltersUpdateLoading ? (
          <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-[0.15] z-[5001] flex items-center justify-center">
            <Loading color="Black" height={7} width={7} />
          </div>
        ) : null}
        <SearchScreen
          appName={appName}
          modelName={modelName}
          searchModel={localSearchModel}
          currentModuleLabel={currentModuleLabel}
          setSearchModal={(value) => setLocalSearchModal(value)}
          hiddenDropdownLookup={`localHiddenDropdownLookup`}
          hiddenSearchLookup={`localHiddenSearchLookup`}
          formClosed={searchFormClosed}
          setDisableSearchButton={(value) => setDisableSearchButton(value)}
          setFormClosed={(value) => setSearchFormClosed(value)}
          useModuleExpression={true}
          handleSearchedSelectedItem={(items) => {
            items.modelName === AccountModels.User
              ? router.push(
                  `/settings/${appName ?? SupportedApps.crm}/users/edit/${
                    items.rowId
                  }`
                )
              : router.push(
                  `${appName ?? SupportedApps.crm}/${items.modelName}/${
                    SupportedView.Detail
                  }/${items.rowId}`
                );
            setLocalSearchModal("-translate-y-full");
            setSearchFormClosed(true);
          }}
          allowFilters={true}
          generateLink={true}
        />
        {displayConversionModal.visible && displayConversionModal.data ? (
          <>
            <GenericFormModalContainer
              formHeading={`Convert ${currentModuleLabel}`}
              onOutsideClick={() =>
                setDisplayConversionModal({ visible: false, data: null })
              }
              limitWidth={true}
              onCancel={() =>
                setDisplayConversionModal({ visible: false, data: null })
              }
            >
              <GenericConversionForm
                modelName={modelName}
                currentModuleLabel={currentModuleLabel}
                data={displayConversionModal.data}
                onCancel={() =>
                  setDisplayConversionModal({ visible: false, data: null })
                }
              />
            </GenericFormModalContainer>
            <Backdrop
              onClick={() =>
                setDisplayConversionModal({ visible: false, data: null })
              }
            />
          </>
        ) : (
          <></>
        )}
        {(deleteModal.visible || deleteBulkItemsModal.visible) && (
          <>
            <DeleteModal
              id={deleteBulkItemsModal.visible ? "delete-all" : deleteModal.id}
              modalHeader={
                deleteBulkItemsModal.visible
                  ? `Delete all selected ${currentModuleLabel}`
                  : `Delete ${currentModuleLabel}`
              }
              modalMessage={`Are you sure you want to delete ${
                deleteBulkItemsModal.visible
                  ? `${
                      selectedItems?.length > 1
                        ? `these ${currentModuleLabel}s?`
                        : `this ${currentModuleLabel}?`
                    }`
                  : `this ${currentModuleLabel}?`
              }`}
              leftButton="Cancel"
              rightButton="Delete"
              loading={bulkDeleteProcessing}
              onCancel={() =>
                deleteBulkItemsModal.visible
                  ? setDeleteBulkItemsModal({ visible: false })
                  : setDeleteModal({ visible: false, id: "" })
              }
              onDelete={
                (deleteBulkItemsModal.visible &&
                  selectedItems.map((item) => item.id)?.length > 1) ||
                capitalCase(dashboardView) === SupportedDashboardViews.Kanban
                  ? async () => {
                      setBulkDeleteProcessing(true);
                      const itemIds: string[] = selectedItems.map(
                        (item) => item.id
                      );
                      const deleteSessionData = JSON.parse(
                        sessionStorage.getItem("bulkDeleteData") || "{}"
                      );
                      bulkUpdateDelete({
                        variables: {
                          ids: itemIds,
                          recordStatus: "d",
                        },
                      }).then((response) => {
                        if (
                          response?.data?.[
                            mutationNameGenerator(
                              SupportedMutationNames.bulkUpdate,
                              modelName
                            )
                          ]?.messageKey.includes("-success")
                        ) {
                          toast.success(
                            response?.data?.[
                              mutationNameGenerator(
                                SupportedMutationNames.bulkUpdate,
                                modelName
                              )
                            ]?.message
                          );
                          const responseId =
                            response?.data?.[
                              mutationNameGenerator(
                                SupportedMutationNames.bulkUpdate,
                                modelName
                              )
                            ].id;
                          const updatedDeleteSessionData: { string: string[] } =
                            {
                              ...deleteSessionData,
                              [modelName]: Object.keys(
                                deleteSessionData?.[modelName] || {}
                              )?.length
                                ? {
                                    ...deleteSessionData[modelName],
                                    [responseId]: itemIds,
                                  }
                                : {
                                    [responseId]: itemIds,
                                  },
                            };
                          sessionStorage.setItem(
                            "bulkDeleteData",
                            JSON.stringify(updatedDeleteSessionData)
                          );
                        } else {
                          Toast.error(
                            response?.data?.[
                              mutationNameGenerator(
                                SupportedMutationNames.bulkUpdate,
                                modelName
                              )
                            ]?.message
                          );
                        }
                        setSelectedItems([]);
                        setBulkDeleteProcessing(false);
                        setDeleteBulkItemsModal({ visible: false });
                      });
                    }
                  : async () => {
                      const itemIds: string[] = selectedItems.map(
                        (item) => item.id
                      );
                      setBulkDeleteProcessing(true);
                      updateBackgroundProcessingInSession("ModelData", true);
                      await serverDeleteData({
                        variables: {
                          id:
                            deleteBulkItemsModal.visible &&
                            itemIds?.length === 1
                              ? itemIds[0]
                              : deleteModal.id,
                          modelName: modelName,
                          saveInput: {
                            recordStatus: "d",
                          },
                        },
                      })
                        .then((response) => {
                          if (response?.data?.save?.data) {
                            handleDelete(response?.data.save.data.id);
                            Toast.success(
                              `${startCase(
                                toLower(
                                  navigations.filter(
                                    (navigation) =>
                                      navigation.navTypeMetadata?.moduleName &&
                                      camelCase(
                                        navigation.navTypeMetadata?.moduleName
                                      ) === modelName
                                  )[0]?.label.en
                                )
                              )} deleted successfully`
                            );
                            updateBackgroundProcessingInSession(
                              "ModelData",
                              false
                            );
                            return;
                          } else {
                            Toast.error(response?.data?.save?.message);
                            updateBackgroundProcessingInSession(
                              "ModelData",
                              false
                            );
                          }
                        })
                        .catch((error) =>
                          updateBackgroundProcessingInSession(
                            "ModelData",
                            false
                          )
                        );
                      if (deleteBulkItemsModal.visible) {
                        setDeleteBulkItemsModal({ visible: false });
                      } else {
                        setDeleteModal({ visible: false, id: "" });
                      }
                      setBulkDeleteProcessing(false);
                      setSelectedItems([]);
                    }
              }
              onOutsideClick={() =>
                deleteBulkItemsModal.visible
                  ? setDeleteBulkItemsModal({ visible: false })
                  : setDeleteModal({ visible: false, id: "" })
              }
            />
            <Backdrop
              onClick={() => setDeleteModal({ visible: false, id: "" })}
            />
          </>
        )}
        {sendEmailModal && (
          <SendEmailModal
            formHeading="Send Email"
            onCancel={(value) => setSendEmailModal(value)}
            selectedItems={selectedItems}
            appName={appName}
            modelName={modelName}
            user={user}
            fieldsList={fieldsList}
            currentModule={currentModule}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
          />
        )}
        {activityFormModal.visible && (
          <>
            <GenericFormModalWrapper
              onCancel={() => setActivityFormModal(emptyModalValues)}
              formDetails={activityFormModal.formDetails}
              onOutsideClick={() => setActivityFormModal(emptyModalValues)}
              stopRouting={false}
              passedId={activityFormModal.formDetails.parentId}
            />
            <Backdrop onClick={() => setActivityFormModal(emptyModalValues)} />
          </>
        )}
        {exportPdfModal && selectedItems?.length > 0 && (
          <ExportPdfModal
            formHeading="Export PDF"
            modelName={modelName}
            selectedItem={selectedItems[0]}
            onCancel={(value) => setExportPdfModal(value)}
          />
        )}
        {saveAsNewCustomViewVisible && (
          <AddNewCustomViewModal
            formHeading="Add Custom View"
            savingProcess={
              customViewFieldsFormLoading || customViewFiltersUpdateLoading
            }
            handleSave={(values) => handleAddFiltersToNewCustomView(values)}
            onCancel={() => setSaveAsNewCustomViewVisible(false)}
          />
        )}
        {customViewFieldsModal?.visible && (
          <>
            <CustomViewFieldsModal
              formHeading="Custom View Fields"
              customView={customViewFieldsModal?.customView}
              fieldsList={fieldsList}
              customViewFieldsList={calculateCurrentCustomModuleViewFields(
                fieldsList,
                customViewFieldsModal?.customView?.id,
                customViews
              )}
              savingProcess={customViewFieldsFormLoading}
              handleSave={(values) =>
                handleCustomViewFieldsUpdate(
                  customViewFieldsModal?.customView,
                  values
                )
              }
              onCancel={() => {
                setCustomViewFieldsModal({ visible: false, customView: null });
              }}
            />
          </>
        )}
      </>
    ) : (
      <NoViewPermission />
    );
  }
);
