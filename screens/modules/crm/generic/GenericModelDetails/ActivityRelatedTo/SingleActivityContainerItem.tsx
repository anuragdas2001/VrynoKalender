import { SingleActivityItem } from "./SingleActivityItem";
import AddBoxIcon from "remixicon-react/AddBoxLineIcon";
import { GenericActivityLoader } from "../../../../../../components/TailwindControls/ContentLoader/Card/GenericActivityLoader";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import GenericFormModal from "../../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import GenericFormModalWrapper from "../../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import {
  ISingleActivityContainerItemProps,
  emptyModalValues,
} from "./activityRelatedToHelper";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";
import { toast } from "react-toastify";

export const SingleActivityContainerItem = ({
  appName,
  modelName,
  recordId,
  relatedName,
  fieldsList,
  activity,
  activityType,
  activityData,
  activityFetchLoading,
  addActivityModal,
  editActivityModal,
  deleteModal,
  deleteProcessing,
  visibleFields,
  handleDeleteModal,
  handleAddActivityData,
  handleUpdatedData,
  handleServerDeleteData,
  changeDisplayFields,
  handleEditActivityModal,
  handleAddActivityModal,
  relatedToField,
  userPreferences,
  activityCount,
  handleActivityLoadMoreClicked,
}: ISingleActivityContainerItemProps) => {
  const activityName = activity?.name ? activity?.name?.toLowerCase() : "";

  return (
    <>
      <div
        className={`w-full pb-3 ${
          userPreferences?.[0]?.defaultPreferences?.[modelName]
            ?.selectedSizeView === "noLimit"
            ? ""
            : "max-h-52"
        }`}
      >
        <div className="flex justify-between border-b mb-3 pb-3 sticky top-0 bg-white z-10">
          <span className="flex items-center">
            {activity.icon}
            {activity.alias}
          </span>
          <div className="flex">
            <Button
              id={`change-fields-${activityType}-${activityName}`}
              customStyle="mr-1 cursor-pointer text-vryno-theme-light-blue"
              onClick={(e) => {
                e.preventDefault();
                if (!activityName.length) {
                  toast.error("Activity name is missing");
                  return;
                }
                changeDisplayFields({
                  visible: true,
                  formDetails: {
                    appName: appName,
                    parentModelName: modelName,
                    modelName: activityName,
                    aliasName: activity.alias,
                    fieldsList: fieldsList,
                  },
                });
              }}
              userEventName={`change-fields-${activityType}-${activityName}-related-activity-modal-click`}
            >
              <EditBoxIcon size={25} />
            </Button>
            <Button
              id={`add-${activityType}-${activityName}`}
              customStyle="mr-1 cursor-pointer text-vryno-theme-light-blue"
              onClick={(e) => {
                e.preventDefault();
                if (!activityName.length) {
                  toast.error("Activity name is missing");
                  return;
                }
                handleAddActivityModal({
                  visible: true,
                  formDetails: {
                    type: "Add",
                    parentId: recordId,
                    parentModelName: modelName,
                    id: null,
                    modelName: activity?.name,
                    aliasName: activity.alias,
                    appName: appName,
                  },
                });
              }}
              userEventName={`open-${activityType}-${activityName}-related-activity-modal-click`}
            >
              <AddBoxIcon size={25} />
            </Button>
          </div>
        </div>
        {activityFetchLoading ? (
          <GenericActivityLoader />
        ) : relatedToField && !relatedToField.visible ? (
          <span className=" text-sm text-gray-400">
            No related to permission
          </span>
        ) : activityData.length ? (
          <div
            className={` flex flex-col gap-y-2 ${
              userPreferences?.[0]?.defaultPreferences?.[modelName]
                ?.selectedSizeView === "noLimit"
                ? ""
                : "max-h-44 overflow-y-scroll"
            }`}
          >
            {activityData.map((data, index) => (
              <div key={index} className={`mr-1 border rounded-lg px-2 py-1`}>
                <SingleActivityItem
                  appName={appName}
                  relatedName={relatedName}
                  data={data}
                  fieldsList={fieldsList}
                  onDelete={(id) => {
                    if (!activityName.length) {
                      toast.error("Activity name is missing");
                      return;
                    }
                    handleDeleteModal({
                      visible: true,
                      item: {
                        modelName: activity?.name,
                        id: id,
                        alias: activity.alias,
                      },
                    });
                  }}
                  onActivityEdit={(id) => {
                    if (!activityName.length) {
                      toast.error("Activity name is missing");
                      return;
                    }
                    handleEditActivityModal({
                      visible: true,
                      formDetails: {
                        type: "Edit",
                        parentId: recordId,
                        parentModelName: modelName,
                        aliasName: activity.alias,
                        id: id,
                        modelName: activity?.name,
                        appName: appName,
                      },
                    });
                  }}
                  activityType={activityType}
                  activityName={activityName}
                  visibleFields={visibleFields}
                />
              </div>
            ))}
            <LoadMoreDataComponent
              itemsCount={activityCount}
              currentDataCount={activityData?.length ?? 0}
              loading={activityFetchLoading}
              handleLoadMoreClicked={handleActivityLoadMoreClicked}
            />
          </div>
        ) : (
          <span className=" text-sm text-gray-400">No record found</span>
        )}
      </div>
      {addActivityModal.visible && (
        <>
          <GenericFormModalWrapper
            formDetails={addActivityModal.formDetails}
            externalData={
              addActivityModal.formDetails?.activityType === "open"
                ? { statusId: "Open", setBy: "label" }
                : addActivityModal.formDetails?.activityType === "closed"
                ? { statusId: "Close", setBy: "label" }
                : {}
            }
            handleAddedRecord={(data) => {
              handleAddActivityData(data);
              handleAddActivityModal(emptyModalValues);
            }}
            onCancel={() => handleAddActivityModal(emptyModalValues)}
            onOutsideClick={() => handleAddActivityModal(emptyModalValues)}
            stopRouting={true}
          />
          <Backdrop onClick={() => handleAddActivityModal(emptyModalValues)} />
        </>
      )}
      {editActivityModal.visible && (
        <>
          <GenericFormModal
            formDetails={editActivityModal.formDetails}
            onUpdatedData={(data) => {
              handleUpdatedData(data);
              handleEditActivityModal(emptyModalValues);
            }}
            onCancel={() => handleEditActivityModal(emptyModalValues)}
            onOutsideClick={() => handleEditActivityModal(emptyModalValues)}
            stopRouting={true}
          />
          <Backdrop onClick={() => handleEditActivityModal(emptyModalValues)} />
        </>
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.item.id}
            modalHeader={`Delete ${deleteModal.item.alias}`}
            modalMessage={`Are you sure you want to delete this ${deleteModal.item.alias}?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={deleteProcessing}
            onCancel={() =>
              handleDeleteModal({
                visible: false,
                item: { modelName: "", id: "", alias: "" },
              })
            }
            onDelete={() => {
              handleServerDeleteData({
                id: deleteModal.item.id,
                modelName: deleteModal.item.modelName,
                saveInput: {
                  recordStatus: "d",
                },
              });
            }}
            onOutsideClick={() =>
              handleDeleteModal({
                visible: false,
                item: { modelName: "", id: "", alias: "" },
              })
            }
          />
          <Backdrop
            onClick={() =>
              handleDeleteModal({
                visible: false,
                item: { modelName: "", id: "", alias: "" },
              })
            }
          />
        </>
      )}
    </>
  );
};
