import React from "react";
import { useMutation } from "@apollo/client";
import { INavigation } from "../../../../../../models/INavigation";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { removeHeight } from "../../../../crm/shared/utils/removeHeight";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { navigationsTableHeaders } from "./NavigationsGroupsItemsListTableHeaders";
import { getSettingsPathParts } from "../../../../crm/shared/utils/getSettingsPathParts";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import _ from "lodash";

const NavigationsGroupsItemsList = ({
  navigationGroupKey,
  updatedNavigations,
  savingProcess,
  filterValue,
  onNavigationFieldEdit,
  removeNavigation,
  handleOrderUpdate = () => {},
  handleVisibilityUpdate = () => {},
}: {
  navigationGroupKey: string;
  updatedNavigations: INavigation[];
  savingProcess: boolean;
  onNavigationFieldEdit: (item: INavigation) => void;
  filterValue: string;
  removeNavigation: (item: INavigation) => void;
  handleOrderUpdate: (itemOne: INavigation, itemTwo: INavigation) => void;
  handleVisibilityUpdate: (item: INavigation) => void;
}) => {
  const { appName } = getSettingsPathParts();
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string;
  }>({ visible: false, id: "" });
  const [deleteProcessing, setDeleteProcessing] =
    React.useState<boolean>(false);
  const navigationsToShow = updatedNavigations.filter(
    (n) => n.groupKey === navigationGroupKey
  );
  const navListContainerRef = React.useRef(null);

  const [serverDeleteData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      setDeleteProcessing(false);
      setDeleteModal({ visible: false, id: "" });
      if (responseOnCompletion?.save?.data) {
        removeNavigation(responseOnCompletion.save.data);
        Toast.success(`Navigation Item deleted successfully`);
        return;
      }
    },
  });

  React.useEffect(() => {
    if (navListContainerRef) {
      if (navigationsToShow?.length > 5) {
        setHeight(navListContainerRef, 35);
      } else {
        removeHeight(navListContainerRef);
      }
    }
  }, [navigationsToShow]);

  if (navigationsToShow.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="mb-6 w-full pr-1 overflow-y-auto"
        ref={navListContainerRef}
      >
        <GenericList
          data={navigationsToShow}
          tableHeaders={navigationsTableHeaders(
            onNavigationFieldEdit,
            (id) => setDeleteModal({ visible: true, id }),
            handleOrderUpdate,
            navigationsToShow,
            savingProcess,
            handleVisibilityUpdate
          )}
          filterValue={filterValue}
          listSelector={false}
        />
      </div>
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader="Delete Navigation"
            modalMessage="Are you sure you want to delete this navigation?"
            leftButton="Cancel"
            rightButton="Delete"
            loading={deleteProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: "" })}
            onDelete={(id) => {
              setDeleteProcessing(true);
              serverDeleteData({
                variables: {
                  id: deleteModal.id,
                  modelName: "NavigationItem",
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
    </>
  );
};

export default NavigationsGroupsItemsList;
