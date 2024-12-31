import React, { useContext } from "react";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../crm/shared/components/GenericBackHeader";
import GenericList from "../../../components/TailwindControls/Lists/GenericList";
import ItemsLoader from "../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import ShareIcon from "remixicon-react/ShareForward2FillIcon";
import { ReportStoreContext } from "../../../stores/ReportStore";
import DeleteModal from "../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import { IDeleteModalState } from "../crm/generic/GenericModelView/GenericModalCardItems";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import { useTranslation } from "next-i18next";
import { setHeight } from "../crm/shared/utils/setHeight";
import { PaginationFilterComponent } from "../../Shared/PaginationFilterCombined";
import _ from "lodash";
import { ReportListActionWrapper } from "./ReportListActionWrapper";
import { ReportDetailEditModal } from "./ReportDetailEditModal";
import { ReportSharingModal } from "./ReportSharingModal";
import { ISharingRuleData } from "../../../models/shared";
import { UserStoreContext } from "../../../stores/UserStore";
import { observer } from "mobx-react-lite";

export const GenericReportScreen = observer(
  ({
    reports,
    loading,
    handleAddReport,
    appName,
    itemsCount,
    currentPageNumber,
    onPageChange = () => {},
  }: {
    reports: Record<string, string>[];
    loading: boolean;
    handleAddReport: (value: boolean) => void;
    appName: string;
    itemsCount: number;
    currentPageNumber: number;
    onPageChange?: (pageNumber: number) => void;
  }) => {
    const { t } = useTranslation(["common"]);

    const userContext = React.useContext(UserStoreContext);
    const { user } = userContext;
    const { removeReport, updateReport } = useContext(ReportStoreContext);
    const [deleteModal, setDeleteModal] = React.useState<IDeleteModalState>({
      visible: false,
      id: "",
    });
    const [reportDetailsEditModal, setReportDetailsEditModal] = React.useState<{
      visible: boolean;
      data: any | null;
    }>({ visible: false, data: null });
    const [reportSharingOptionsModal, setReportSharingOptionsModal] =
      React.useState<{
        visible: boolean;
        data: any | null;
      }>({ visible: false, data: null });
    const [moduleViewSharingData, setModuleViewSharingData] =
      React.useState<ISharingRuleData | null>(null);

    const [filterValue, setFilterValue] = React.useState<string>("");

    const [
      serverDeleteData,
      { loading: deleteProcessing, error: deleteError, data: deleteData },
    ] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.save?.data) {
          removeReport(deleteModal.id);
          setDeleteModal({ visible: false, id: "" });
          toast.success(`Report deleted successfully`);
          return;
        }
        if (responseOnCompletion.save.messageKey) {
          toast.error(responseOnCompletion?.save?.message);
          return;
        }
        toast.error(t("common:unknown-message"));
      },
    });

    const editMenuArray = [
      {
        icon: (
          <EditBoxIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: "Update",
        onClick: (data: any) => {
          return setReportDetailsEditModal({ visible: true, data: data });
        },
      },
      {
        icon: <ShareIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
        label: "Share",
        onClick: (data: any) => {
          setReportSharingOptionsModal({ visible: true, data: data });
          setModuleViewSharingData({
            sharedType: data.sharedType,
            sharedUsers: data.sharedUsers,
          });
        },
      },
      {
        icon: (
          <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: "Delete",
        onClick: (data: any) => {
          setDeleteModal({ visible: true, id: data.id });
        },
      },
    ];

    const heightRef = React.useRef(null);
    React.useEffect(() => {
      if (heightRef) {
        setHeight(heightRef, 30);
      }
    }, [reports, user?.id]);

    return (
      <>
        <GenericBackHeader heading="Reports" showBackButton={false}>
          <div>
            <Button
              id="add-report"
              buttonType="thin"
              onClick={() => handleAddReport(true)}
              userEventName="open-add-report-modal-click"
            >
              <span className="flex items-center gap-x-2">
                <AddCircleFillIcon />
                Report
              </span>
            </Button>
          </div>
        </GenericBackHeader>
        {itemsCount > 0 && reports.length > 0 && (
          <div className="px-6 py-3">
            <PaginationFilterComponent
              filterName={"reports"}
              currentPageItemCount={reports.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`hidden sm:flex sm:justify-between`}
            />
            <PaginationFilterComponent
              filterName={"reports"}
              currentPageItemCount={reports.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`sm:hidden flex flex-col`}
            />
          </div>
        )}
        <div className="px-6">
          {!loading && reports?.length === 0 ? (
            <NoDataFoundContainer
              modelName="Reports"
              onClick={() => handleAddReport(true)}
            />
          ) : !loading && user?.id ? (
            <div className="bg-white px-4 py-4 rounded-xl">
              <div
                ref={heightRef}
                className="flex flex-col lg:flex-row overflow-y-auto bg-white"
              >
                <GenericList
                  listSelector={false}
                  rowUrlGenerator={(item) => `/reports/crm/view/${item.id}`}
                  filterValue={filterValue}
                  tableHeaders={[
                    {
                      columnName: "name",
                      label: "Report Name",
                      dataType: "singleline",
                    },
                    {
                      columnName: "description",
                      label: "Description",
                      dataType: "multiline",
                    },
                    {
                      columnName: "createdAt",
                      label: "Created at",
                      dataType: "date",
                    },
                    {
                      columnName: "updatedAt",
                      label: "Updated At",
                      dataType: "date",
                    },
                    {
                      columnName: "actions",
                      label: "Actions",
                      dataType: "singleline",
                      render: (item: any, index: number) => {
                        return (
                          <ReportListActionWrapper
                            index={index}
                            record={item}
                            recordId={item?.id}
                            editMenuArray={editMenuArray}
                            zIndexValue={reports.length - index}
                            user={user}
                          />
                        );
                      },
                    },
                  ]}
                  data={reports}
                />
              </div>
            </div>
          ) : (
            <div className="p-6">
              {ItemsLoader({ currentView: "List", loadingItemCount: 4 })}
            </div>
          )}
        </div>
        {deleteModal.visible && (
          <>
            <DeleteModal
              id={deleteModal.id}
              modalHeader={`Delete Report`}
              modalMessage={`Are you sure you want to delete this Report?`}
              leftButton="Cancel"
              rightButton="Delete"
              loading={deleteProcessing}
              onCancel={() => setDeleteModal({ visible: false, id: "" })}
              onDelete={(id) => {
                serverDeleteData({
                  variables: {
                    id: deleteModal.id,
                    modelName: "report",
                    saveInput: {
                      recordStatus: "d",
                    },
                  },
                });
              }}
              onOutsideClick={() => setDeleteModal({ visible: false, id: "" })}
            />
            <Backdrop
              onClick={() => setDeleteModal({ visible: false, id: "" })}
            />
          </>
        )}
        {reportDetailsEditModal.visible && (
          <ReportDetailEditModal
            setReportDetailsEditModal={(data: {
              visible: boolean;
              data: any | null;
            }) => setReportDetailsEditModal(data)}
            reportDetailsEditModal={reportDetailsEditModal}
            updateReport={updateReport}
          />
        )}
        {reportSharingOptionsModal.visible && (
          <ReportSharingModal
            setReportSharingOptionsModal={(data: {
              visible: boolean;
              data: any | null;
            }) => setReportSharingOptionsModal(data)}
            reportSharingOptionsModal={reportSharingOptionsModal}
            updateReport={updateReport}
            moduleViewSharingData={moduleViewSharingData}
          />
        )}
      </>
    );
  }
);
