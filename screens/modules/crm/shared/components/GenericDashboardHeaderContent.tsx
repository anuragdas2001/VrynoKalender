import _, { get } from "lodash";
import ConvertLinIcon from "remixicon-react/ExchangeLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import ButtonWithDropdown from "../../../../../components/TailwindControls/Form/Button/ButtonWithDropdown";
import { useRouter } from "next/router";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../utils/appsUrlGenerator";
import { sliderWindowType } from "./SliderWindow";
import {
  ICustomView,
  IGenericConversionFormData,
  IUserPreference,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { ICustomField } from "../../../../../models/ICustomField";
import FilePDFIcon from "remixicon-react/FilePdfFillIcon";
import { CustomViewSideBarMenuItem } from "../../generic/GenericModelView/CustomViewSideBarMenuItem";
import { useTranslation } from "react-i18next";
import React from "react";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { AppModels } from "../../../../../models/AppModels";
import { useMutation } from "@apollo/client";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import SettingIcon from "remixicon-react/Settings2FillIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import MenuFoldLineIcon from "remixicon-react/MenuFoldLineIcon";
import MenuUnfoldLineIcon from "remixicon-react/MenuUnfoldLineIcon";
import MailLineIcon from "remixicon-react/MailLineIcon";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { observer } from "mobx-react-lite";
import { User } from "../../../../../models/Accounts";
import { ICustomViewFilter } from "../../generic/GenericAddCustomView/customViewHelpers/customFilterHelper";
import { SelectUnSelectAllButton } from "./SelectUnselectAllButton";

export const GenericDashboardHeaderContent = observer(
  ({
    appName,
    modelName,
    fieldsList,
    currentDashboardView,
    KVRecordData,
    customViewsSideBarVisible,
    disableSearchButton,
    modelData,
    selectedItems,
    loading,
    itemsCount,
    newDataFoundWithSideNavFilters,
    customViews,
    currentCustomView,
    defaultCustomViewId,
    userPreferences,
    setZIndex = () => {},
    handleSelectAllItems,
    handleUnselectAllItems,
    setCustomViewsSideBarVisible,
    setLocalSearchModal,
    deleteSelectedItems,
    setEmailTemplateModal,
    setExportPdfModal,
    handleCustomViewSelection = () => {},
    salesOrderModuleLabel,
    invoiceModuleLabel,
    setDisplayConversionModal,
    user,
    setCurrentCustomViewById,
    setCurrentCustomViewFilter,
    setCurrentCustomViewId,
    setDefaultCustomViewId,
    importUserPreferences,
    removeCustomView,
  }: {
    customViewsSideBarVisible: boolean;
    disableSearchButton: boolean;
    modelData: any[];
    selectedItems: any[];
    loading: boolean;
    itemsCount: number;
    appName: SupportedApps;
    modelName: string;
    fieldsList: ICustomField[];
    currentDashboardView: SupportedDashboardViews;
    KVRecordData: any[];
    newDataFoundWithSideNavFilters?: boolean;
    customViews: ICustomView[];
    currentCustomView?: ICustomView;
    defaultCustomViewId: string | undefined;
    userPreferences: IUserPreference[];
    user: User | null;
    setZIndex?: (value: boolean) => void;
    handleSelectAllItems: () => void;
    handleUnselectAllItems: () => void;
    setCustomViewsSideBarVisible: (value: boolean) => void;
    setLocalSearchModal: (value: sliderWindowType) => void;
    deleteSelectedItems: (value: boolean) => void;
    setEmailTemplateModal: (value: boolean) => void;
    setExportPdfModal: (value: boolean) => void;
    handleCustomViewSelection?: (item: any) => void;
    salesOrderModuleLabel: string;
    invoiceModuleLabel: string;
    setDisplayConversionModal: (value: IGenericConversionFormData) => void;
    setCurrentCustomViewId: (
      customViewId: string | undefined,
      moduleName: string
    ) => void;
    setCurrentCustomViewFilter: (
      customViewFilterData: {
        filters: ICustomViewFilter[];
        expression: string | null;
      },
      moduleName: string
    ) => void;
    setCurrentCustomViewById: (
      customViewId: string,
      moduleName: string
    ) => void;
    setDefaultCustomViewId: (
      customViewId: string | undefined,
      moduleName: string
    ) => void;
    removeCustomView: (customView: ICustomView, moduleName: string) => void;
    importUserPreferences: (userPreferences: IUserPreference[]) => void;
  }) => {
    const router = useRouter();
    const { t } = useTranslation(["common"]);
    const sessionData = sessionStorage.getItem("ActiveModuleView");
    const [currentCustomViewSelected, setCurrentCustomviewSelected] =
      React.useState<any>();
    const [saveProcessing, setSaveProcessing] = React.useState<boolean>(false);
    const [deleteModal, setDeleteModal] = React.useState<{
      visible: boolean;
      id: string | null;
    }>({ visible: false, id: null });

    React.useEffect(() => {
      if (customViews && currentCustomView) {
        setCurrentCustomviewSelected(currentCustomView);
      }
    }, [customViews, currentCustomView, modelName]);

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

    const handleUserPreference = (
      status: boolean,
      customViewId: string,
      customView: ICustomView
    ) => {
      const updatedUserPreferences =
        userPreferences && userPreferences.length > 0
          ? userPreferences[0]
          : null;
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
          setDefaultCustomViewId(status ? customViewId : "", modelName);
          setCurrentCustomViewFilter(
            status
              ? {
                  filters: customView.filters,
                  expression: customView.expression,
                }
              : { filters: [], expression: null },
            modelName
          );
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
          const currentCustomView =
            currentCustomViewSelected?.id === id && defaultCustomViewId === id
              ? customViews?.filter(
                  (customView) => customView?.id === "default-view"
                )
              : currentCustomViewSelected?.id === id &&
                defaultCustomViewId !== id
              ? customViews?.filter(
                  (customView) => customView?.id === defaultCustomViewId
                )
              : currentCustomViewSelected?.id
              ? customViews?.filter(
                  (customView) =>
                    customView?.id === currentCustomViewSelected?.id
                )?.length > 0
                ? customViews?.filter(
                    (customView) =>
                      customView?.id === currentCustomViewSelected?.id
                  )
                : defaultCustomViewId
                ? customViews?.filter(
                    (customView) => customView?.id === defaultCustomViewId
                  )
                : customViews?.filter(
                    (customView) => customView?.id === "default-view"
                  )
              : customViews?.filter(
                  (customView) => customView?.id === "default-view"
                );
          setCurrentCustomViewId(
            currentCustomViewSelected?.id === id
              ? "default-view"
              : currentCustomViewSelected?.id ?? "",
            modelName
          );
          if (currentCustomViewSelected?.id === id)
            setCurrentCustomViewFilter(
              { filters: [], expression: null },
              modelName
            );
          setCurrentCustomViewById(
            currentCustomViewSelected?.id === id && defaultCustomViewId === id
              ? "default-view"
              : currentCustomViewSelected?.id === id &&
                defaultCustomViewId !== id
              ? defaultCustomViewId
              : currentCustomViewSelected?.id ?? "",
            modelName
          );
          handleCustomViewSelection(currentCustomView[0]);
          setCurrentCustomviewSelected(currentCustomView[0]);
          if (sessionData) {
            const storedActiveView = JSON.parse(sessionData);
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
      <div className="w-full flex items-center justify-between sm:justify-start gap-x-4">
        <div className={`flex gap-x-4`}>
          {customViewsSideBarVisible ? (
            <Button
              id={"dashboard-sidebar-close"}
              onClick={() => setCustomViewsSideBarVisible(false)}
              customStyle={``}
              userEventName="generic-dashboard-sidebar:close-click"
            >
              <MenuFoldLineIcon
                className={`text-vryno-theme-light-blue cursor-pointer `}
              />
            </Button>
          ) : (
            <Button
              id={"dashboard-sidebar-open"}
              onClick={() => setCustomViewsSideBarVisible(true)}
              customStyle={``}
              userEventName="generic-dashboard-sidebar:open-click"
            >
              <MenuUnfoldLineIcon
                className={`text-vryno-theme-light-blue cursor-pointer `}
              />
            </Button>
          )}
          <ButtonWithDropdown
            id={`select-custom-view-menu`}
            onClick={() => {}}
            kind="secondary"
            setZIndex={setZIndex}
            disabled={loading}
            buttonType="thin"
            externalLaunchMenu={
              <div
                className={`origin-top-right absolute left-0 z-[1000] mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none top-9 max-h-[70vh] p-2`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div
                  className={`w-full max-h-[50vh] overflow-y-auto overflow-x-hidden card-scroll pr-1 mb-2`}
                  style={{ fontSize: "13px", lineHeight: "18.5px" }}
                >
                  {customViews?.map((customView, index) => (
                    <CustomViewSideBarMenuItem
                      key={index}
                      user={user}
                      index={index}
                      datatestid={customView.name}
                      currentCustomView={currentCustomView}
                      customView={customView}
                      defaultCustomViewId={defaultCustomViewId}
                      setCurrentCustomviewSelected={
                        setCurrentCustomviewSelected
                      }
                      handleCustomViewSelection={handleCustomViewSelection}
                      handleUserPreference={(
                        status: boolean,
                        customViewId: string,
                        customView: ICustomView
                      ) =>
                        handleUserPreference(status, customViewId, customView)
                      }
                      handleDeleteCustomView={(customView) =>
                        setDeleteModal({ visible: true, id: customView?.id })
                      }
                      handleEditCustomView={(customView) =>
                        router.push(
                          appsUrlGenerator(
                            appName,
                            modelName,
                            AllowedViews.customView,
                            customView.id
                          )
                        )
                      }
                    />
                  ))}
                </div>
                <Button
                  id="add-custom-view"
                  onClick={() => {
                    router.push(
                      appsUrlGenerator(
                        appName,
                        modelName,
                        AllowedViews.customView
                      )
                    );
                  }}
                  kind="next"
                  userEventName="open-add-customView-page-click"
                >
                  <span
                    className={`flex justify-center items-center w-full h-full`}
                  >
                    <span
                      className={`flex items-center justify-center gap-x-2`}
                      style={{ fontSize: "13px", lineHeight: "18.5px" }}
                    >
                      <AddCircleFillIcon size={16} className="" />
                      Custom View
                    </span>
                  </span>
                </Button>
              </div>
            }
            dropdownIconData={
              <span
                className={`px-2 col-span-2 sm:col-span-8 flex justify-center items-center w-[135px] h-full`}
                title={currentCustomView?.name}
              >
                <span
                  className={`hidden sm:block break-all truncate ${
                    loading ? "text-black" : ""
                  }`}
                  style={{ fontSize: "13px", lineHeight: "18.5px" }}
                >
                  {currentCustomView?.name}
                </span>
              </span>
            }
          />
          <div>
            <Button
              id="local-search"
              kind="white"
              onClick={() => setLocalSearchModal("")}
              disabled={disableSearchButton}
              userEventName={`open-localSearch-${modelName}-modal-click`}
            >
              <SearchLineIcon className="text-vryno-theme-blue" size={20} />
            </Button>
          </div>
          <SelectUnSelectAllButton
            modelData={modelData}
            selectedItems={selectedItems}
            currentDashboardView={currentDashboardView}
            handleSelectAllItems={handleSelectAllItems}
            handleUnselectAllItems={handleUnselectAllItems}
          />
        </div>
        <div
          className={`h-full mb-1 ${
            selectedItems.length > 0 ? "" : "invisible"
          }`}
        >
          <ButtonWithDropdown
            id={`selected-item-action-menu`}
            onClick={() => {}}
            kind="primary"
            disabled={loading}
            alignDropdownMenu="left"
            launchMenuArray={[
              {
                label: "Delete Selected",
                onClick: () => {
                  deleteSelectedItems(true);
                },
                icon: (
                  <DeleteBin5LineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                labelClasses: "text-vryno-dropdown-icon",
                visible: true,
              },
              {
                label: "Send Email",
                icon: (
                  <MailLineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                onClick: () => {
                  setEmailTemplateModal(true);
                },
                labelClasses: "text-vryno-dropdown-icon",
                visible:
                  selectedItems?.length > 0 &&
                  fieldsList?.filter((field) => field.dataType === "email")
                    .length > 0
                    ? true
                    : false,
              },
              {
                label: "Export PDF",
                icon: (
                  <FilePDFIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                onClick: () => {
                  setExportPdfModal(true);
                },
                labelClasses: "text-vryno-dropdown-icon",
                visible: selectedItems?.length === 1 ? true : false,
              },
              {
                label: "Convert",
                icon: (
                  <ConvertLinIcon
                    size={18}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                onClick: () => {
                  router?.replace(
                    appsUrlGenerator(
                      appName,
                      modelName,
                      AllowedViews.conversion,
                      selectedItems[0].id
                    )
                  );
                },
                labelClasses: "text-vryno-dropdown-icon",
                visible:
                  modelName === "lead" && selectedItems.length === 1
                    ? true
                    : false,
              },
              {
                label: `Convert to ${salesOrderModuleLabel}`,
                icon: (
                  <ConvertLinIcon
                    size={18}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                onClick: () =>
                  setDisplayConversionModal({
                    data: {
                      convertToModuleLabel: salesOrderModuleLabel,
                      id: selectedItems[0].id,
                      modelName: "quoteToSalesOrder",
                    },
                    visible: true,
                  }),
                labelClasses: "text-vryno-dropdown-icon",
                visible:
                  modelName === "quote" &&
                  selectedItems.length === 1 &&
                  !_.get(selectedItems[0], "quoteConverted", false)
                    ? true
                    : false,
              },
              {
                label: `Convert to ${invoiceModuleLabel}`,
                icon: (
                  <ConvertLinIcon
                    size={18}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                onClick: () =>
                  setDisplayConversionModal({
                    data: {
                      convertToModuleLabel: invoiceModuleLabel,
                      id: selectedItems[0].id,
                      modelName:
                        modelName === "quote"
                          ? "quoteToInvoice"
                          : "salesOrderToInvoice",
                    },
                    visible: true,
                  }),
                labelClasses: "text-vryno-dropdown-icon",
                visible:
                  modelName === "quote" &&
                  selectedItems.length === 1 &&
                  !_.get(selectedItems[0], "quoteConverted", false)
                    ? true
                    : modelName === "salesOrder" &&
                      selectedItems.length === 1 &&
                      !_.get(selectedItems[0], "salesOrderConverted", false)
                    ? true
                    : false,
              },
            ]}
            dropdownIconData={
              <span
                className={`px-2 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
              >
                <SettingIcon size={20} className="mr-2" />
                <span className={`hidden sm:flex`}>Action</span>
              </span>
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
              onOutsideClick={() =>
                setDeleteModal({ visible: false, id: null })
              }
            />
            <Backdrop
              onClick={() => setDeleteModal({ visible: false, id: null })}
            />
          </>
        )}
      </div>
    );
  }
);
