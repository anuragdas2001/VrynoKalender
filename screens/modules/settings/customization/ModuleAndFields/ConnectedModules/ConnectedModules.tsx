import _ from "lodash";
import { CustomizationContainer } from "../../Shared/CustomizationContainer";
import { ConnectedAddModule } from "./ConnectedAddModule";
import React, { useContext, useState } from "react";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { CustomizationLoader } from "../../Shared/CustomizationLoader";
import CustomizationModulesTable from "./CustomizationModulesTable";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { settingsUrlGenerator } from "../../../../crm/shared/utils/settingsUrlGenerator";
import { IRole, SupportedApps } from "../../../../../../models/shared";
import EqualizerLineIcon from "remixicon-react/EqualizerLineIcon";
import ShareCircleFillIcon from "remixicon-react/ShareCircleFillIcon";
import TaxIcon from "remixicon-react/MoneyDollarCircleLineIcon";
import { SettingsMenuItem } from "../../../../../../models/Settings";
import { useMutation } from "@apollo/client";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { NoViewPermission } from "../../../../crm/shared/components/NoViewPermission";
import { toast } from "react-toastify";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import DataLoadErrorContainer from "../../../../crm/shared/components/DataLoadErrorContainer";
import { EditModuleModalForm } from "./EditModuleModalForm";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import { useTranslation } from "next-i18next";
import { getDisplayExpression } from "../ConnectedFields/handleCustomFieldSave";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { getSortedModuleByNavigation } from "../../../../crm/shared/utils/getSortedModuleListAccordingToNavigation";
import { FormikValues } from "formik";
import { ModuleListActionWrapper } from "./ModuleListActionWrapper";
import { observer } from "mobx-react-lite";

const MAPPING_LINKS = {
  lead: "lead-conversion-mapping",
  quote: "quote-conversion-mapping",
  quotedItem: "quoted-item-conversion-mapping",
  salesOrder: "sales-order-conversion-mapping",
  orderedItem: "ordered-item-conversion-mapping",
};

export const ConnectedModules = observer(() => {
  const { t } = useTranslation(["common"]);
  const { appName } = getAppPathParts();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allModulesFetched,
    deleteModule,
    moduleViewPermission,
    allLayoutFetched,
    importModuleInfo,
    importModuleLayouts,
    importFields,
  } = generalModelStore;
  const { navigations, removeNavigation, importNavigations } = useContext(
    NavigationStoreContext
  );
  const [modulesFetched, setModulesFetched] = useState<IModuleMetadata[]>([]);
  const [viewPermission, setViewPermission] = React.useState(true);
  const [moduleFetchLoading, setModuleFetchLoading] = useState(true);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string;
  }>({ visible: false, id: "" });
  const [deleteProcessing, setDeleteProcessing] =
    React.useState<boolean>(false);
  let count = modulesFetched.length;
  const [errorLoadingPage, setErrorLoadingPage] = React.useState(false);
  const [reloadingPage, setReloadingPage] = React.useState(false);
  const [moduleFormModal, setModuleFormModal] = React.useState<{
    visible: boolean;
    data: IModuleMetadata | null;
  }>({ visible: false, data: null });
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const editMenuArray = [
    {
      icon: (
        <EqualizerLineIcon
          size={17}
          className="mr-2 text-vryno-dropdown-icon"
        />
      ),
      label: "Permissions",
      rowUrlGenerator: (data: IRole) => {
        return settingsUrlGenerator(SupportedApps.crm, "role-permission");
      },
    },
    {
      icon: (
        <EqualizerLineIcon
          size={17}
          className="mr-2 text-vryno-dropdown-icon"
        />
      ),
      label: "Map Dependency Fields",
      rowUrlGenerator: (data: IRole) => {
        return settingsUrlGenerator(
          SupportedApps.crm,
          SettingsMenuItem.moduleFields,
          data.name,
          ["fields-dependency"]
        );
      },
    },
  ];

  const modulesTableHeaders = (
    count: number,
    data: IModuleMetadata[],
    onDeleteClick: (id: string) => void
  ) => [
    {
      label: "Displayed As",
      columnName: "label.en",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Module Name",
      columnName: "name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "System Defined",
      columnName: "systemDefined",
      dataType: SupportedDataTypes.boolean,
    },
    {
      columnName: "actions",
      label: "Actions",
      dataType: SupportedDataTypes.singleline,
      render: (record: IModuleMetadata, index: number) => {
        let dropdownArray = [];
        if (record.name === "product" && record.systemDefined) {
          dropdownArray = [
            ...editMenuArray,
            {
              icon: (
                <TaxIcon size={17} className="mr-2 text-vryno-dropdown-icon" />
              ),
              label: "Taxation",
              rowUrlGenerator: (data: IRole) =>
                settingsUrlGenerator(
                  SupportedApps.crm,
                  SettingsMenuItem.moduleFields,
                  "product-tax",
                  ["product-tax"]
                ),
            },
          ];
        } else if (
          MAPPING_LINKS[record.name as keyof typeof MAPPING_LINKS] &&
          record.systemDefined === true
        ) {
          dropdownArray = [
            ...editMenuArray,
            {
              icon: (
                <ShareCircleFillIcon
                  size={17}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: "Mapping",
              rowUrlGenerator: (data: IRole) =>
                settingsUrlGenerator(
                  SupportedApps.crm,
                  SettingsMenuItem.moduleFields,
                  MAPPING_LINKS[record.name as keyof typeof MAPPING_LINKS],
                  [MAPPING_LINKS[record.name as keyof typeof MAPPING_LINKS]]
                ),
            },
          ];
        } else if (record.name === "deal" && record.systemDefined === true) {
          dropdownArray = [
            ...editMenuArray,
            {
              icon: (
                <ShareCircleFillIcon
                  size={17}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: "Pipeline",
              rowUrlGenerator: (data: IRole) =>
                settingsUrlGenerator(
                  SupportedApps.crm,
                  SettingsMenuItem.moduleFields,
                  "deal-pipeline",
                  ["deal-pipeline"]
                ),
            },
          ];
        } else if (record.systemDefined !== true) {
          dropdownArray = [
            ...editMenuArray,
            {
              icon: (
                <DeleteBinLineIcon
                  size={17}
                  className="mr-2 text-vryno-dropdown-icon w-"
                />
              ),
              label: "Delete",
              onClick: () => onDeleteClick(record.id),
            },
          ];
        } else {
          dropdownArray = editMenuArray;
        }
        return (
          <ModuleListActionWrapper
            index={index}
            record={record}
            recordId={record?.id}
            dropdownArray={dropdownArray}
            zIndexValue={data.length - index}
            setModuleFormModal={setModuleFormModal}
          />
        );
      },
    },
  ];

  const [serverDeleteData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      setDeleteProcessing(false);
      if (responseOnCompletion?.save?.data) {
        let updatedModulesFetchedList = modulesFetched.filter(
          (module) => module.id !== responseOnCompletion.save.data.id
        );
        setModulesFetched(updatedModulesFetchedList);
        setItemsCount(itemsCount - 1);
        Toast.success(`Module deleted successfully`);
        return;
      }
      if (responseOnCompletion?.save.messageKey) {
        toast.error(responseOnCompletion?.save?.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const [updateCustomModule] = useAppSaveMutation<IModuleMetadata>({
    appPath: appName,
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        let updatedModulesFetchedList = modulesFetched;
        let updatedModuleIndex = modulesFetched.findIndex(
          (module) => module.name === responseOnCompletion.save.data.name
        );
        updatedModulesFetchedList[updatedModuleIndex] =
          responseOnCompletion.save.data;
        setModulesFetched(updatedModulesFetchedList);
        importModuleInfo(
          responseOnCompletion?.save?.data,
          responseOnCompletion?.save?.data?.name
        );
        Toast.success("Module updated successfully");
        setModuleFormModal({ visible: false, data: null });
        setSavingProcess(false);
        return;
      }
      setSavingProcess(false);
      setModuleFormModal({ visible: false, data: null });
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    },
  });

  const handleModuleUpdate = async (values: FormikValues) => {
    setSavingProcess(true);
    try {
      await updateCustomModule({
        variables: {
          id:
            moduleFormModal?.data?.id === "no-id"
              ? null
              : moduleFormModal?.data?.id,
          modelName: "Module",
          saveInput: {
            label: { en: values.label },
            name: moduleFormModal?.data?.name,
            displayExpression:
              values?.searchByFields && values?.searchByFields?.length > 0
                ? getDisplayExpression(values?.searchByFields)
                : "",
          },
        },
      });
    } catch (error) {}
  };

  React.useEffect(() => {
    if (allModulesFetched && moduleViewPermission) {
      setModuleFetchLoading(false);
      setErrorLoadingPage(false);
      setReloadingPage(false);
      let modulesFetched = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined),
      ];
      setModulesFetched([...modulesFetched]);
      setItemsCount(modulesFetched?.length);
    }
  }, [allModulesFetched, moduleViewPermission, itemsCount]);

  React.useEffect(() => {
    setViewPermission(moduleViewPermission);
  }, [moduleViewPermission]);

  return (
    <>
      <CustomizationContainer
        heading={"Modules & Fields"}
        showTabBar={true}
        buttons={
          <ConnectedAddModule
            setModulesFetched={setModulesFetched}
            modulesFetched={getSortedModuleByNavigation(
              navigations,
              modulesFetched
            )}
            loading={moduleFetchLoading}
            setItemsCount={(value: number) => setItemsCount(value)}
            itemsCount={itemsCount}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            importFields={importFields}
            importModuleInfo={importModuleInfo}
            importModuleLayouts={importModuleLayouts}
            importNavigations={importNavigations}
          />
        }
        hidePagination={false}
        currentPageItemCount={itemsCount}
        itemsCount={itemsCount}
        setFilterValue={(value) => setFilterValue(value)}
      >
        {viewPermission ? (
          errorLoadingPage ? (
            <DataLoadErrorContainer
              onClick={() => {
                setModuleFetchLoading(true);
                setReloadingPage(true);
              }}
              loadingData={moduleFetchLoading}
            />
          ) : (
            <div className="w-full h-full">
              {moduleFetchLoading ? (
                <CustomizationLoader loading={moduleFetchLoading} />
              ) : (
                <CustomizationModulesTable
                  modulesFetched={getSortedModuleByNavigation(
                    navigations,
                    modulesFetched
                  )}
                  modulesTableHeaders={modulesTableHeaders(
                    count,
                    getSortedModuleByNavigation(navigations, modulesFetched),
                    (id) => setDeleteModal({ visible: true, id })
                  )}
                  filterValue={filterValue}
                />
              )}
            </div>
          )
        ) : (
          <NoViewPermission shadow={false} />
        )}
      </CustomizationContainer>
      {moduleFormModal.visible && (
        <EditModuleModalForm
          appName={appName}
          data={moduleFormModal.data}
          editMode={true}
          modulesFetched={getSortedModuleByNavigation(
            navigations,
            modulesFetched
          )}
          visible={moduleFormModal.visible}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          setAddModuleModal={setModuleFormModal}
          handleModuleCreation={(values) => handleModuleUpdate(values)}
          savingProcess={savingProcess}
        />
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader="Delete Module"
            modalMessage="Are you sure you want to delete this module?"
            leftButton="Cancel"
            rightButton="Delete"
            loading={deleteProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: "" })}
            onDelete={(id) => {
              setDeleteProcessing(true);
              serverDeleteData({
                variables: {
                  id: deleteModal.id,
                  modelName: "Module",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              }).then((response) => {
                if (response.data.save.data) {
                  removeNavigation(response.data.save.data.name);
                  deleteModule(response.data.save.data.name);
                  setDeleteModal({ visible: false, id: "" });
                }
              });
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: "" })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: "" })}
          />
        </>
      )}
    </>
  );
});
