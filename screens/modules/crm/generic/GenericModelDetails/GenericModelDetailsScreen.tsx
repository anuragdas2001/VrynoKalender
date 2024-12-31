import React, { useContext, useState } from "react";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import { getDataObject } from "../../shared/utils/getDataObject";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import {
  IGenericConversionFormData,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import {
  emptyModalValues,
  GeneralVisibilityProps,
  IFormModalObject,
} from "./IGenericFormDetails";
import PageNotFound from "../../shared/components/PageNotFound";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { GenericModelDetailsScreenPresentational } from "./GenericModelDetailsScreenPresentational";
import {
  checkForAnyBackgroundProcessRunning,
  updateBackgroundProcessingInSession,
} from "../../../shared";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import _, { startCase, toLower, get } from "lodash";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { camelCase } from "change-case";
import { useTranslation } from "next-i18next";
import { AccountModels } from "../../../../../models/Accounts";
import { sortFieldList } from "../../shared/components/Form/FormCustomization/sortFieldList";
import { getFieldsWithOrder } from "../../shared/components/Form/FormCustomization/getFieldsWithOrder";
import { getNavigationLabel } from "../../shared/utils/getNavigationLabel";
import { IGenericActivityLabel } from "./TypesGenericModelDetails";
import { checkModuleNavVisibility } from "../../shared/utils/checkModuleNavVisibility";
import { EditDropdownListGenerator } from "./EditDropdownListGenerator";
import { IAttachmentModal } from "./Attachments/attachmentHelper";
import { IFormActivityModalObject } from "./ActivityRelatedTo/activityRelatedToHelper";
import { getDetailCardContainerOrder } from "../../shared/utils/getDetailCardContainerOrderFromPreference";
import { UserStoreContext } from "../../../../../stores/UserStore";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import { observer } from "mobx-react-lite";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";
import { checkFieldsListContainRelatedTo } from "../GenericForms/Shared/genericFormSharedFunctions";

export interface SendEmailModalRecordsType {
  id: string;
  appName: SupportedApps;
  fieldsList: ICustomField[];
  modelName: string;
  currentModule: IModuleMetadata;
  selectedItems: Partial<{ id: string }>[];
}

export type cardContainerOrderType = {
  id: string;
  label: string;
  name: string;
  type: string;
  order: number;
  value: string;
  metadata?: Record<string, any>;
};

const getDetailCardVisible = (
  cardVisibleArray: { id: string | undefined; value: boolean }[],
  cardId: string | undefined,
  cardVisible: boolean
) => {
  let updatedCardVisibleArray = [...cardVisibleArray];
  let findIndexOfContainer = updatedCardVisibleArray?.findIndex(
    (cardContainer) => cardContainer.id === cardId
  );
  if (findIndexOfContainer !== -1)
    updatedCardVisibleArray.splice(findIndexOfContainer, 1);
  updatedCardVisibleArray.push({ id: cardId, value: cardVisible });
  return updatedCardVisibleArray;
};

interface IGenericModelDetailsScreenProps {
  modelName: string;
  appName: SupportedApps;
  id: string;
  relatedFilter?: string;
  relatedFilterId?: string;
  currentModule?: IModuleMetadata;
  backgroundProcessRunning?: boolean;
  setBackgroundProcessRunning?: (value: boolean) => void;
}
export const GenericModelDetailsScreen = observer(
  ({
    appName,
    modelName,
    id,
    relatedFilter,
    relatedFilterId,
    currentModule,
    setBackgroundProcessRunning = () => {},
  }: IGenericModelDetailsScreenProps) => {
    const { navigations } = useContext(NavigationStoreContext);
    const { t } = useTranslation(["common"]);
    const router = useRouter();
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      userPreferences,
      moduleViewPermission,
      importUserPreferences,
      setItemsCount,
      importModuleDataByCustomViewId,
      setInitialModuleLoading,
      setModuleViewPermission,
      setCurrentPageDataLoading,
    } = generalModelStore;
    const [modelNameFromNavigation, setModelNameFromNavigation] =
      React.useState<string>(modelName);
    const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
    const [fetchingPreferences, setFetchingPreferences] =
      React.useState<boolean>(true);
    const currentCustomViewId =
      genericModels[modelNameFromNavigation]?.currentCustomViewId ??
      "default-view";
    const currentModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: currentModule?.name,
      currentModuleLabel: currentModule ? currentModule?.label.en : "",
      defaultLabel: modelNameFromNavigation,
    });
    let allModuleDataByCustomViewID =
      genericModels[modelNameFromNavigation]?.moduleData;
    let moduleData =
      allModuleDataByCustomViewID &&
      allModuleDataByCustomViewID[currentCustomViewId]
        ? allModuleDataByCustomViewID[currentCustomViewId]
        : [];
    let itemsCount = genericModels[modelNameFromNavigation]?.itemsCount
      ? genericModels[modelNameFromNavigation]?.itemsCount[currentCustomViewId]
      : 0;
    const [sideNavigationRefreshed, setSideNavigationRefreshed] =
      React.useState(true);
    const [previousRecordId, setPreviousRecordId] = React.useState<string>();
    const [nextRecordId, setNextRecordId] = React.useState<string>();
    const [exportPdfModal, setExportPdfModal] = React.useState<boolean>(false);
    const [cardContainerOrder, setCardContainerOrder] = React.useState<
      cardContainerOrderType[]
    >([]);
    const [refetchRecordData, setRefetchRecordData] =
      React.useState<boolean>(false);
    const [sections, setSections] = React.useState<SectionDetailsType[]>([
      {
        sectionOrder: 0,
        sectionName: "details",
        sectionLabel: "Details",
        sectionFields: fieldsList,
        sectionFieldsWithOrder: [],
        columnLayout: "4",
        systemDefined: true,
      },
    ]);
    const [hasRelatedTo, setHasRelatedTo] = React.useState(false);
    const [hasFieldPreferences, setHasFieldPreferences] =
      React.useState<boolean>(false);
    const [savingUserPreference, setSavingUserPreference] =
      React.useState<boolean>(false);
    // Modals State - start
    const [quickCreateReverseLookupModal, setQuickCreateReverseLookupModal] =
      React.useState<{
        reverseLookupName: string;
        visible: boolean;
      }>({ reverseLookupName: "", visible: false });
    const [quickCreateNoteModal, setQuickCreateNoteModal] =
      React.useState(false);
    const [addAttachmentUrlModalForm, setAddAttachmentUrlModalForm] =
      React.useState<IAttachmentModal>({
        visible: false,
        data: {},
        id: null,
      });
    const [addAttachmentModalForm, setAddAttachmentModalForm] =
      React.useState<IAttachmentModal>({
        visible: false,
        data: {},
        id: null,
      });
    const [executeActivitySave, setExecuteActivitySave] = React.useState<
      any | null
    >(null);
    const [addActivityModal, setAddActivityModal] =
      React.useState<IFormActivityModalObject>(emptyModalValues);
    // Modals State - end
    const [chooseFieldModal, setChooseFieldModal] = React.useState<{
      reverseLookupName: string;
      visible: boolean;
    }>({ reverseLookupName: "", visible: false });

    const [modelData, setModelData] = React.useState<any>({});
    const [modelDetailData, setModelDetailData] = React.useState<any>(null);
    const [dataFetchLoading, setDataFetchLoading] =
      React.useState<boolean>(true);
    const [fetchNewRecordsLoading, setFetchNewRecordsLoading] =
      React.useState<boolean>(false);
    const [launchMenuVisible, setLaunchMenuVisible] =
      React.useState<GeneralVisibilityProps>({
        visible: false,
        id: null,
      });
    const [deleteModal, setDeleteModal] =
      React.useState<GeneralVisibilityProps>({
        visible: false,
        id: "",
      });
    const [sendMassEmailRecords, setSendMassEmailRecords] =
      React.useState<SendEmailModalRecordsType>();
    const [sendEmailModal, setSendEmailModal] = React.useState(false);
    const [formModal, setFormModal] =
      React.useState<IFormModalObject>(emptyModalValues);
    const [sideModalClass, setSideModalClass] = useState("-translate-x-full");
    const [activeRelatedId, setActiveRelatedId] = useState(id);
    const updateModelData = (value: any) => {
      relatedFilter
        ? setModelDetailData(getDataObject(value))
        : setModelData(getDataObject(value));
    };
    const [navActivityModuleLabels, setNavActivityModuleLabel] =
      React.useState<IGenericActivityLabel>({
        task: "Task",
        meeting: "Meeting",
        callLog: "Call Log",
      });

    const salesOrderModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: "salesOrder",
      currentModuleLabel: "Sales Orders",
      defaultLabel: modelNameFromNavigation,
    });

    const invoiceModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: "invoice",
      currentModuleLabel: "Invoices",
      defaultLabel: modelNameFromNavigation,
    });

    const [displayConversionModal, setDisplayConversionModal] =
      React.useState<IGenericConversionFormData>({
        data: null,
        visible: false,
      });
    let EditDropdownList = EditDropdownListGenerator({
      id,
      modelName: modelNameFromNavigation,
      currentModuleLabel,
      appName,
      navActivityModuleLabels,
      setSendEmailModal,
      setFormModal,
      setExportPdfModal,
      setDeleteModal,
      router,
      salesOrderModuleLabel,
      invoiceModuleLabel,
      setDisplayConversionModal,
      quoteConverted:
        _.get(modelData, "quoteConverted", null) ||
        _.get(modelDetailData, "quoteConverted", null),
      salesOrderConverted:
        _.get(modelData, "salesOrderConverted", null) ||
        _.get(modelDetailData, "salesOrderConverted", null),
    });

    const [getDataList] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
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
          handleUpdateUserPreferences();
          setSavingUserPreference(false);
          return;
        }
        if (responseOnCompletion.save.messageKey) {
          setSavingUserPreference(false);
          return;
        }
        setSavingUserPreference(false);
        return;
      },
    });

    const [getDataById] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const [serverDeleteData] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.save?.data) {
          toast.success(
            `${startCase(
              toLower(
                navigations.filter(
                  (navigation) =>
                    navigation.navTypeMetadata?.moduleName &&
                    camelCase(navigation.navTypeMetadata?.moduleName) ===
                      modelNameFromNavigation
                )[0]?.label.en
              )
            )} deleted successfully`
          );
          router
            ?.replace(
              appsUrlGenerator(
                appName,
                modelNameFromNavigation,
                AllowedViews.view
              )
            )
            .then();
          return;
        }
        if (responseOnCompletion.save.messageKey) {
          toast.error(responseOnCompletion?.save?.message);
          return;
        }
        toast.error(t("common:unknown-message"));
      },
    });

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
            setFetchingPreferences(false);
          }
        }
        setFetchingPreferences(false);
      },
      onError: (error) => {
        setFetchingPreferences(false);
      },
    });

    const handleFetchDataById = async () => {
      let fieldsList =
        genericModels[modelName]?.fieldsList &&
        genericModels[modelName]?.fieldsList?.length > 0
          ? [...getSortedFieldList(genericModels[modelName]?.fieldsList)]
          : [];
      try {
        await getDataById({
          variables: {
            modelName: modelNameFromNavigation,
            fields: getVisibleFieldsArray(fieldsList),
            filters: [
              { name: "id", operator: "eq", value: id?.toString() || "" },
              {
                operator: "in",
                name: "recordStatus",
                value: ["a", "i"],
              },
            ],
          },
        }).then((response) => {
          setDataFetchLoading(false);
          if (response?.data?.fetch.data) {
            relatedFilter
              ? setModelDetailData(getDataObject(response.data.fetch.data[0]))
              : setModelData(getDataObject(response.data.fetch.data[0]));
          } else {
            toast.error(response?.data?.fetch.message);
          }
          updateBackgroundProcessingInSession("GetDataById", false);
        });
        setRefetchRecordData(false);
      } catch (error) {
        console.error(error);
        updateBackgroundProcessingInSession("GetDataById", false);
        setRefetchRecordData(false);
      }
    };

    const handleUpdateUserPreferences = async (value?: boolean) => {
      if (value !== null && value !== undefined)
        setSideNavigationRefreshed(false);
      await getUserPreferences({
        variables: {
          modelName: AccountModels.Preference,
          fields: ["id", "serviceName", "defaultPreferences"],
          filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
        },
      });
      if (value !== null && value !== undefined)
        setSideNavigationRefreshed(true);
    };

    const handleNewRecordsFetch = async (value: "next" | "previous") => {
      const pageSize = genericModels[modelNameFromNavigation]?.pageSize ?? 10;
      setFetchNewRecordsLoading(true);
      const findIdIndex = moduleData?.findIndex((data) => data?.id === id);
      const pageNumber =
        value === "next"
          ? Math.ceil(findIdIndex / 50) + 1
          : Math.ceil(findIdIndex / 50);
      try {
        getDataList({
          variables: {
            customViewId: currentCustomViewId,
            modelName: modelNameFromNavigation,
            fields: [],
            filters: [],
            pageNumber: pageNumber,
            recordsPerPage: pageSize,
          },
        }).then((response) => {
          if (response?.data?.fetch?.data) {
            const updatedModelData = response?.data.fetch.data.map(
              (item: any) => {
                let responseObj = {};
                for (const key in item) {
                  if (key.includes("fields.")) {
                    responseObj = {
                      ...responseObj,
                      [key.slice(key.indexOf(".") + 1)]: item[key],
                    };
                  } else {
                    responseObj = { ...responseObj, [key]: item[key] };
                  }
                }
                return responseObj;
              }
            );
            setItemsCount(
              response?.data?.fetch.count,
              modelNameFromNavigation,
              currentCustomViewId
            );
            setInitialModuleLoading(true, modelNameFromNavigation);
            setModuleViewPermission(true, modelNameFromNavigation);
            setCurrentPageDataLoading(
              true,
              modelNameFromNavigation,
              pageNumber,
              currentCustomViewId
            );

            importModuleDataByCustomViewId(
              updatedModelData,
              pageNumber ?? 1,
              modelNameFromNavigation,
              response?.data.fetch.count,
              currentCustomViewId
            );
            updateBackgroundProcessingInSession("ModelData", false);
            setFetchNewRecordsLoading(false);
            value === "previous"
              ? router.push(
                  {
                    pathname: appsUrlGenerator(
                      appName,
                      modelNameFromNavigation,
                      AllowedViews.detail,
                      updatedModelData &&
                        updatedModelData?.length > 0 &&
                        updatedModelData[updatedModelData?.length - 1]?.id,
                      [relatedFilter || "", relatedFilterId || ""]
                    ),
                  },
                  undefined
                )
              : router.push(
                  {
                    pathname: appsUrlGenerator(
                      appName,
                      modelNameFromNavigation,
                      AllowedViews.detail,
                      updatedModelData &&
                        updatedModelData?.length > 0 &&
                        updatedModelData[0]?.id,
                      [relatedFilter || "", relatedFilterId || ""]
                    ),
                  },
                  undefined
                );
            return;
          } else if (response?.data?.fetch.messageKey.includes("view")) {
            updateBackgroundProcessingInSession("ModelData", false);
            setFetchNewRecordsLoading(false);
            return;
          } else {
            updateBackgroundProcessingInSession("ModelData", false);
            setFetchNewRecordsLoading(false);
            return;
          }
        });
      } catch (error) {}
      setFetchNewRecordsLoading(false);
    };

    const handleIdChange = (idValue: string) => {
      let variables: Record<string, any> = {
        modelName: modelNameFromNavigation,
        fields: getVisibleFieldsArray(fieldsList),
        filters: [
          { name: "id", operator: "eq", value: idValue },
          {
            operator: "in",
            name: "recordStatus",
            value: ["a", "i"],
          },
        ],
      };
      try {
        getDataById({
          variables: variables,
        }).then((response) => {
          if (response?.data?.fetch.data) {
            relatedFilter
              ? setModelDetailData(getDataObject(response.data.fetch.data[0]))
              : setModelData(getDataObject(response.data.fetch.data[0]));
          } else {
            toast.error(response?.data?.fetch.message);
          }
        });
      } catch (error) {
        console.error(error);
      }
      router
        .push(
          {
            pathname: appsUrlGenerator(
              appName,
              modelNameFromNavigation,
              AllowedViews.detail,
              idValue,
              [relatedFilter || "", relatedFilterId || ""]
            ),
          },
          undefined
        )
        .then();
      setActiveRelatedId(idValue);
    };

    const handleOpenCollapseCardContainer = (
      cardId: string | undefined,
      showDetails: boolean
    ) => {
      const updatedUserPreferences =
        userPreferences && userPreferences.length > 0
          ? userPreferences[0]
          : null;
      const defaultPreferences = updatedUserPreferences
        ? { ...updatedUserPreferences.defaultPreferences }
        : {};

      setSavingUserPreference(true);
      saveUserPreference({
        variables: {
          id: updatedUserPreferences ? updatedUserPreferences.id : null,
          modelName: AccountModels.Preference,
          saveInput: {
            defaultPreferences: {
              ...defaultPreferences,
              [modelNameFromNavigation]: get(
                defaultPreferences,
                modelNameFromNavigation,
                null
              )
                ? {
                    ...get(defaultPreferences, modelNameFromNavigation),
                    detailCardContainerOrder: getDetailCardContainerOrder(
                      cardContainerOrder,
                      modelNameFromNavigation,
                      fieldsList
                    ),
                    detailCardsVisible: get(
                      defaultPreferences[modelNameFromNavigation],
                      "detailCardsVisible",
                      null
                    )
                      ? getDetailCardVisible(
                          [
                            ...get(
                              defaultPreferences[modelNameFromNavigation],
                              "detailCardsVisible"
                            ),
                          ],
                          cardId,
                          showDetails
                        )
                      : [{ id: cardId ?? "", value: showDetails }],
                  }
                : {
                    detailCardContainerOrder: getDetailCardContainerOrder(
                      cardContainerOrder,
                      modelNameFromNavigation,
                      fieldsList
                    ),
                    detailCardsVisible: [
                      { id: cardId ?? "", value: showDetails },
                    ],
                  },
            },
            serviceName: SupportedApps.crm,
          },
        },
      });
    };

    React.useEffect(() => {
      if (
        allLayoutFetched &&
        modelNameFromNavigation &&
        modelName === modelNameFromNavigation
      ) {
        let fieldsList =
          genericModels[modelNameFromNavigation]?.fieldsList &&
          genericModels[modelNameFromNavigation]?.fieldsList?.length > 0
            ? [
                ...getSortedFieldList(
                  genericModels[modelNameFromNavigation]?.fieldsList
                ),
              ]
            : [];
        setFieldsList([...fieldsList]);
      }
    }, [allLayoutFetched, modelNameFromNavigation, modelName]);

    React.useEffect(() => {
      if (refetchRecordData) {
        handleFetchDataById();
      }
    }, [refetchRecordData]);

    React.useEffect(() => {
      getUserPreferences({
        variables: {
          modelName: AccountModels.Preference,
          fields: ["id", "serviceName", "defaultPreferences"],
          filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
        },
      });
    }, [modelNameFromNavigation]);

    React.useEffect(() => {
      setBackgroundProcessRunning(checkForAnyBackgroundProcessRunning());
    }, [
      JSON.parse(localStorage.getItem("BackgroundProccessRunning") ?? "{ }"),
    ]);

    React.useEffect(() => {
      const findIdIndex = moduleData?.findIndex((data) => data?.id === id);
      if (moduleData[findIdIndex - 1]) {
        setPreviousRecordId(get(moduleData[findIdIndex - 1], "id", ""));
      } else setPreviousRecordId("");

      if (moduleData[findIdIndex + 1]) {
        setNextRecordId(get(moduleData[findIdIndex + 1], "id", ""));
      } else setNextRecordId("");
    }, [id, moduleData]);

    React.useEffect(() => {
      setNavActivityModuleLabel({
        task: checkModuleNavVisibility(navigations, "task")
          ? getNavigationLabel({
              navigations: navigations,
              currentModuleName: "task",
              currentModuleLabel: "Task",
              defaultLabel: "Task",
            })
          : null,
        meeting: checkModuleNavVisibility(navigations, "meeting")
          ? getNavigationLabel({
              navigations: navigations,
              currentModuleName: "meeting",
              currentModuleLabel: "Meeting",
              defaultLabel: "Meeting",
            })
          : null,
        callLog: checkModuleNavVisibility(navigations, "callLog")
          ? getNavigationLabel({
              navigations: navigations,
              currentModuleName: "callLog",
              currentModuleLabel: "Call Log",
              defaultLabel: "Call Log",
            })
          : null,
      });
    }, [navigations?.length]);

    React.useEffect(() => {
      if (
        fieldsList?.length <= 0 ||
        !appName ||
        !id ||
        !modelNameFromNavigation ||
        modelName !== modelNameFromNavigation ||
        !allLayoutFetched
      )
        return;
      setDataFetchLoading(true);
      updateBackgroundProcessingInSession("GetDataById", true);
      setModelData({});
      setModelDetailData(null);
      handleFetchDataById();
      updateBackgroundProcessingInSession("GetDataById", false);
    }, [modelNameFromNavigation, fieldsList, id, appName]);

    React.useEffect(() => {
      if (
        id &&
        modelNameFromNavigation &&
        modelName === modelNameFromNavigation
      ) {
        setDataFetchLoading(true);
        updateBackgroundProcessingInSession("GetDataById", true);
        setModelData({});
      }
    }, [id, modelNameFromNavigation]);

    React.useEffect(() => {
      if (modelName) {
        setModelNameFromNavigation(modelName);
      }
    }, [modelName]);

    React.useEffect(() => {
      if (
        !modelNameFromNavigation ||
        fieldsList?.length <= 0 ||
        modelName !== modelNameFromNavigation
      )
        return;
      const updatedUserPreferences =
        userPreferences && userPreferences.length > 0
          ? userPreferences[0]
          : null;
      const defaultPreferences = updatedUserPreferences
        ? { ...updatedUserPreferences.defaultPreferences }
        : {};
      let defaultPreferencesForModule = _.get(
        defaultPreferences,
        modelNameFromNavigation,
        {}
      );
      let newSections = _.get(
        defaultPreferencesForModule,
        "formCustomizationPerModule",
        []
      );
      let updatedSections: SectionDetailsType[] = [...newSections];

      if (
        updatedSections &&
        updatedSections?.length > 0 &&
        fieldsList?.length > 0
      ) {
        let combinedSectionsFieldList: ICustomField[] = [];
        updatedSections.forEach(
          (section: SectionDetailsType) =>
            (combinedSectionsFieldList = [
              ...combinedSectionsFieldList,
              ...section?.sectionFields,
            ])
        );
        let totalFieldList = fieldsList?.filter((field) => field.visible);
        let newFieldsAdded: ICustomField[] = [];
        totalFieldList?.forEach((field) => {
          const findIndexInExisting = combinedSectionsFieldList?.findIndex(
            (combinedField) => combinedField.name === field.name
          );
          if (findIndexInExisting === -1)
            newFieldsAdded = [...newFieldsAdded, field];
        });

        updatedSections.forEach(
          (section: SectionDetailsType) => (section.sectionFields = fieldsList)
        );
        const findIndexOfDetailSection = updatedSections?.findIndex(
          (updatedSection) => updatedSection.sectionName === "details"
        );
        updatedSections[findIndexOfDetailSection].sectionFieldsWithOrder = [
          ...updatedSections[findIndexOfDetailSection].sectionFieldsWithOrder,
          ...newFieldsAdded?.map((field) => {
            return {
              fieldName: field.name,
              order: field.order,
              dataType: field.dataType,
              visible: field.visible,
              readOnly: field.readOnly,
              addInForm: field.addInForm,
            };
          }),
        ];
        if (
          checkFieldsListContainRelatedTo(fieldsList) &&
          updatedSections?.findIndex(
            (section) => section.sectionName === "relatedTo"
          ) === -1
        ) {
          updatedSections = [
            ...updatedSections,
            {
              sectionOrder: updatedSections.length++,
              sectionName: "relatedTo",
              sectionLabel: "Related To",
              sectionFields: fieldsList,
              sectionFieldsWithOrder: [],
              columnLayout: "4",
              systemDefined: true,
            },
          ];
        }
        updatedSections?.forEach((section) => {
          if (section.sectionName === "relatedTo") {
            section.sectionFields = fieldsList?.filter(
              (field) => field.name === "relatedTo" && field.systemDefined
            );
            section.sectionFieldsWithOrder = sortFieldList(
              getFieldsWithOrder(
                fieldsList?.filter(
                  (field) => field.name === "relatedTo" && field.systemDefined
                )
              )
            );
          }
        });
        setSections(updatedSections);
        setHasFieldPreferences(true);
      } else {
        let updatedSections = [...sections];
        if (
          checkFieldsListContainRelatedTo(fieldsList) &&
          updatedSections?.findIndex(
            (section) => section.sectionName === "relatedTo"
          ) === -1
        ) {
          updatedSections = [
            ...updatedSections,
            {
              sectionOrder: 1,
              sectionName: "relatedTo",
              sectionLabel: "Related To",
              sectionFields: fieldsList,
              sectionFieldsWithOrder: [],
              columnLayout: "4",
              systemDefined: true,
            },
          ];
        }
        updatedSections?.forEach((section) => {
          if (section.sectionName === "relatedTo") {
            section.sectionFields = fieldsList?.filter(
              (field) => field.name === "relatedTo" && field.systemDefined
            );
            section.sectionFieldsWithOrder = sortFieldList(
              getFieldsWithOrder(
                fieldsList?.filter(
                  (field) => field.name === "relatedTo" && field.systemDefined
                )
              )
            );
          } else {
            section.sectionFields = fieldsList;
            section.sectionFieldsWithOrder = sortFieldList(
              getFieldsWithOrder(
                fieldsList?.filter((field) => field.name !== "relatedTo")
              )
            );
          }
        });
        setSections(updatedSections);
      }
    }, [userPreferences, fieldsList, modelNameFromNavigation]);

    React.useEffect(() => {
      if (fieldsList.length) {
        for (let i = 0; i < fieldsList.length; i++) {
          if (
            fieldsList[i].dataType === "relatedTo" &&
            fieldsList[i].visible === true &&
            fieldsList[i].systemDefined === true
          ) {
            setHasRelatedTo(true);
            break;
          }
        }
      }
    }, [fieldsList]);

    if (
      fieldsList.length <= 0 ||
      !currentModule ||
      modelName !== modelNameFromNavigation
    ) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    if (
      fetchingPreferences ||
      dataFetchLoading ||
      (dataFetchLoading && Object.keys(modelData).length <= 0) ||
      (id &&
        modelData &&
        Object.keys(modelData)?.length > 0 &&
        modelData?.id !== id)
    ) {
      return (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col  items-center justify-center"
        >
          <PageLoader />
        </div>
      );
    }

    if (modelData?.data?.length === 0) {
      return (
        <PageNotFound
          message="Sorry we could not find the record that you were looking for !"
          show404={false}
        />
      );
    }

    const presentationProps = {
      id,
      user,
      appName,
      modelDetailData,
      modelName,
      activeRelatedId,
      relatedFilter,
      relatedFilterId,
      fieldsList,
      currentModule,
      launchMenuVisible,
      EditDropdownList,
      sideModalClass,
      sendEmailModal,
      moduleData,
      previousRecordId,
      nextRecordId,
      itemsCount,
      fetchNewRecordsLoading,
      deleteModal,
      formModal,
      userPreferences,
      sections,
      hasRelatedTo,
      navActivityModuleLabels,
      currentModuleLabel,
      sideNavigationRefreshed,
      exportPdfModal,
      quickCreateReverseLookupModal,
      chooseFieldModal,
      setChooseFieldModal,
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      moduleViewPermission,
      setModelData,
      setModelDetailData,
      setQuickCreateReverseLookupModal,
      setFormModal,
      setExportPdfModal,
      updateModelData,
      handleNewRecordsFetch,
      setDeleteModal,
      serverDeleteData,
      handleIdChange,
      setSendEmailModal,
      setSideModalClass,
      setLaunchMenuVisible,
      setSideNavigationRefreshed,
      handleUpdateUserPreferences,
      handleOpenCollapseCardContainer,
      quickCreateNoteModal,
      setQuickCreateNoteModal,
      setAddAttachmentUrlModalForm,
      setAddAttachmentModalForm,
      addAttachmentUrlModalForm,
      addAttachmentModalForm,
      setExecuteActivitySave,
      executeActivitySave,
      setAddActivityModal,
      cardContainerOrder,
      setCardContainerOrder,
      addActivityModal,
      displayConversionModal,
      setDisplayConversionModal,
      setRefetchRecordData,
      sendMassEmailRecords,
      setSendMassEmailRecords,
    };
    return (modelData && id === modelData?.id) ||
      (modelDetailData && id === modelDetailData?.id) ? (
      <GenericModelDetailsScreenPresentational
        modelData={{ ...modelData }}
        {...presentationProps}
      />
    ) : modelData &&
      Object.keys(modelData)?.length <= 0 &&
      !modelDetailData?.id &&
      !dataFetchLoading ? (
      <PageNotFound
        message="Sorry we could not find the record that you were looking for !"
        show404={false}
      />
    ) : (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col  items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  }
);
