import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  DELETE_INSTANCE_MUTATION,
  DELETE_SAMPLE_DATA_MUTATION,
  DeleteInstanceData,
  DeleteInstanceVars,
  UPDATE_INSTANCE_MUTATION,
  UpdateInstanceData,
  UpdateInstanceVars,
} from "../../../graphql/mutations/instances";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import InstanceList from "./InstanceList";
import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import { IInstance } from "../../../models/Accounts";
import { SupportedApps, SupportedDashboardViews } from "../../../models/shared";
import { SupportedDataTypes } from "../../../models/ICustomField";
import { InstanceStoreContext } from "../../../stores/InstanceStore";
import { observer } from "mobx-react-lite";
import { InstanceDeleteModal } from "./InstanceDeleteModal";
import { InstanceRemoveSampleModal } from "./InstanceRemoveSampleModal";
import {
  InstanceDashboardHeaderBar,
  ViewStoreKey,
} from "./InstanceDashboardHeaderBar";
import { InstanceAddEditLightBox } from "./InstanceAddEditLightBox";
import { InstanceItemsLoader } from "./InstanceItemsLoader";
import { InstanceCardItems } from "./InstanceCardItems";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import { setHeight } from "../crm/shared/utils/setHeight";
import { PaginationFilterComponent } from "../../Shared/PaginationFilterCombined";
import { InstanceActionWrapper } from "./InstanceActionWrapper";
import { DetailRecordImageControl } from "../crm/shared/components/ReadOnly/DetailRecordImageControl";

export interface InstanceDashboardProps {
  instances: IInstance[];
  loading?: boolean;
  loadingItemCount?: number;
  dataProcessingCompleted?: boolean;
  modelName: string;
  itemsCount: number;
  setItemsCount: (value: number) => void;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
}

export type SampleModalType = {
  visible: boolean;
  item: IInstance | null;
};

export const InstanceDashboard = observer(
  ({
    instances,
    loading = false,
    loadingItemCount = 3,
    dataProcessingCompleted,
    modelName,
    itemsCount,
    setItemsCount,
    currentPageNumber,
    onPageChange,
  }: InstanceDashboardProps) => {
    const router = useRouter();
    const { locale } = router;
    const { removeInstance, addInstance } = useContext(InstanceStoreContext);
    const [deleteInstanceProcessing, setDeleteInstanceProcessing] =
      useState<boolean>(false);
    const [filterValue, setFilterValue] = React.useState<string>("");
    const { t } = useTranslation(["instances", "common"]);
    const [currentView, setCurrentView] =
      React.useState<SupportedDashboardViews>(
        (sessionStorage.getItem(ViewStoreKey) as SupportedDashboardViews) ||
          SupportedDashboardViews.Card
      );
    const [tableHeaders, setTableHeaders] = React.useState<
      {
        label: string;
        columnName: string;
        dataType: SupportedDataTypes;
        render?: (record: IInstance, index: number) => React.JSX.Element;
      }[]
    >([]);
    const [instanceLightbox, setInstanceLightbox] =
      React.useState<IDeleteModalState>({
        visible: false,
        id: "",
      });
    const [deleteModal, setDeleteModal] = React.useState<IDeleteModalState>({
      visible: false,
      id: "",
    });

    const [removeSampleDataModal, setRemoveSampleDataModal] =
      React.useState<SampleModalType>({
        visible: false,
        item: null,
      });
    const [sampleDataRemovalLoading, setSampleDataRemovalLoading] =
      React.useState(false);

    const [serverDeleteInstance] = useMutation<
      DeleteInstanceData,
      DeleteInstanceVars
    >(DELETE_INSTANCE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (responseOnCompletion) => {
        setDeleteInstanceProcessing(false);
        if (
          responseOnCompletion?.deleteInstance?.messageKey.includes("-success")
        ) {
          if (instances.length === 1) {
            onPageChange(currentPageNumber === 1 ? 1 : currentPageNumber - 1);
          }
          setItemsCount(itemsCount - 1);
          removeInstance(responseOnCompletion.deleteInstance.data.id);
          router?.replace("/instances", "/instances", { locale }).then();
          toast.success(t("instance-deleted-successfully"));
          setDeleteModal({ visible: false, id: "" });
          return;
        }
      },
    });

    const [deleteSampleData] = useMutation(DELETE_SAMPLE_DATA_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
          subdomain: removeSampleDataModal.item
            ? removeSampleDataModal.item?.subdomain
            : "",
        },
      },
      onCompleted: (responseOnCompletion) => {
        setSampleDataRemovalLoading(false);
        if (responseOnCompletion) {
          setRemoveSampleDataModal({ visible: false, item: null });
          toast.success(t("sample-data-delete-success"));
          return;
        }
      },
    });

    const [UpdateInstance] = useMutation<
      UpdateInstanceData,
      UpdateInstanceVars
    >(UPDATE_INSTANCE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (data) => {
        if (
          data.updateInstance.data &&
          data.updateInstance.messageKey === "instance-updation-success"
        ) {
          addInstance(data.updateInstance.data);
          deleteSampleData().then();
        }
      },
    });

    const heightRef = useRef(null);
    React.useEffect(() => {
      if (heightRef) {
        setHeight(heightRef, 20);
      }
    });

    React.useEffect(() => {
      setTableHeaders([
        {
          label: "",
          columnName: "logo",
          dataType: SupportedDataTypes.recordImage,
          render: (record: IInstance, index: number) => (
            <DetailRecordImageControl
              field={{
                label: "",
                value: "logo",
                dataType: "recordImage",
                field: undefined,
              }}
              data={record}
              onDetail={false}
              isSample={false}
              imageServiceName={SupportedApps.crm}
              imageServiceModelName="Company"
              imageServiceSubdomain={record.subdomain}
            />
          ),
        },
        {
          label: "Instance Name",
          columnName: "name",
          dataType: SupportedDataTypes.singleline,
        },
        {
          label: "Sub Domain",
          columnName: "subdomain",
          dataType: SupportedDataTypes.singleline,
        },
        {
          label: "Instance Admins",
          columnName: "instanceAdmins",
          dataType: SupportedDataTypes.singleline,
        },
        {
          label: "Description",
          columnName: "description",
          dataType: SupportedDataTypes.singleline,
        },
        {
          label: "Actions",
          columnName: "actions",
          dataType: SupportedDataTypes.singleline,
          render: (record: IInstance, index: number) => (
            <InstanceActionWrapper
              index={index}
              record={record}
              instances={instances}
              setDeleteModal={setDeleteModal}
              setInstanceLightbox={setInstanceLightbox}
              setRemoveSampleDataModal={setRemoveSampleDataModal}
            />
          ),
        },
      ]);
    }, [instances]);

    return (
      <>
        <div className="flex flex-col w-full h-full pt-6 px-6 ">
          <InstanceDashboardHeaderBar
            headerTitle={t("instance-dashboard")}
            loading={loading}
            currentView={currentView}
            setCurrentView={setCurrentView}
            onDesktopAddInstanceClick={() => {
              router.push("/instances/add").then();
            }}
            addButtonText={t("Instance")}
            onMobileAddInstanceClick={() => {
              setInstanceLightbox({ visible: true, id: "" });
            }}
          />
          {!dataProcessingCompleted ? (
            InstanceItemsLoader(currentView, loadingItemCount)
          ) : dataProcessingCompleted && instances.length === 0 ? (
            <NoDataFoundContainer
              modelName="instance"
              onClick={() => {
                setInstanceLightbox({ visible: true, id: "" });
              }}
            />
          ) : (
            <div className="flex flex-col">
              <div className="mt-4 mb-2">
                <PaginationFilterComponent
                  filterName={"users"}
                  currentPageItemCount={instances.length}
                  currentPageNumber={currentPageNumber}
                  onPageChange={onPageChange}
                  setFilterValue={setFilterValue}
                  itemsCount={itemsCount}
                  classStyle={`flex flex-col sm:flex sm:justify-between`}
                  hideSearchBar={currentView === SupportedDashboardViews.Card}
                />
              </div>
              {currentView === SupportedDashboardViews.Card ? (
                <div
                  ref={heightRef}
                  className="overflow-y-auto pr-1 card-scroll"
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-x-6 gap-y-6">
                    <InstanceCardItems
                      locale={locale || ""}
                      instances={instances}
                      router={router}
                      setInstanceLightbox={setInstanceLightbox}
                      setDeleteModal={setDeleteModal}
                      setRemoveSampleDataModal={setRemoveSampleDataModal}
                      modelName={modelName}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="pt-4 px-4 bg-white rounded-xl">
                    <div
                      ref={heightRef}
                      className="overflow-x-scroll overflow-y-auto pr-1 card-scroll"
                    >
                      {instances && (
                        <InstanceList
                          data={instances}
                          tableHeaders={tableHeaders}
                          setEditModal={(value) => setInstanceLightbox(value)}
                          setDeleteModal={(value) => setDeleteModal(value)}
                          setRemoveSampleDataModal={(value) => {
                            setRemoveSampleDataModal(value);
                          }}
                          filterValue={filterValue}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <InstanceAddEditLightBox
          {...{ instanceLightbox, setInstanceLightbox }}
          itemsCount={itemsCount}
          setItemsCount={(value) => setItemsCount(value)}
        />
        <InstanceDeleteModal
          deleteModal={deleteModal}
          deleteInstanceProcessing={deleteInstanceProcessing}
          setDeleteModal={(value) => setDeleteModal(value)}
          serverDeleteInstance={serverDeleteInstance}
          setDeleteInstanceProcessing={(value) =>
            setDeleteInstanceProcessing(value)
          }
        />
        <InstanceRemoveSampleModal
          {...{
            removeSampleDataModal,
            sampleDataRemovalLoading,
            setRemoveSampleDataModal,
            setSampleDataRemovalLoading,
            UpdateInstance,
          }}
        />
      </>
    );
  }
);
