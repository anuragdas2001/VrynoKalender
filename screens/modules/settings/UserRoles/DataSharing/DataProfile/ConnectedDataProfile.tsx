import React from "react";
import "rc-tree/assets/index.css";
import { DataProfileTree } from "./DataProfileTree";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { AddDataProfile } from "./DataProfileOperations/AddDataProfile";
import { EditDataProfile } from "./DataProfileOperations/EditDataProfile";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IProfileData } from "../../../../../../models/DataSharingModels";
import { TreeNodeClass } from "../utils/TreeNodeClass";

export interface IAddEditProfileModal {
  visible: boolean;
  id: null | string;
}

export const ConnectedDataProfile = ({
  viewSelectorComponent,
  loading,
  rootNode,
  allParentIdOptions,
  profileData,
  setProfileData,
  setRootNode,
  setAllParentIdOptions,
  profileDataDict,
  setProfileDataDict,
}: {
  viewSelectorComponent: () => React.JSX.Element;
  loading: boolean;
  rootNode: TreeNodeClass | null;
  allParentIdOptions: {
    value: string | null;
    label: string;
  }[];
  profileData: IProfileData[];
  setProfileData: (value: IProfileData[]) => void;
  setRootNode: (value: TreeNodeClass | null) => void;
  setAllParentIdOptions: (
    value: {
      value: string | null;
      label: string;
    }[]
  ) => void;
  profileDataDict: Record<string, IProfileData[]>;
  setProfileDataDict: (value: Record<string, IProfileData[]>) => void;
}) => {
  const [addDataProfileModal, setAddDataProfileModal] =
    React.useState<IAddEditProfileModal>({
      visible: false,
      id: null,
    });
  const [editDataProfileModal, setEditDataProfileModal] =
    React.useState<IAddEditProfileModal>({
      visible: false,
      id: null,
    });

  return loading ? (
    <>
      <GenericBackHeader heading="Data Profile" />
      <div className="px-6 py-0">
        <ItemsLoader currentView="List" loadingItemCount={2} />
      </div>
    </>
  ) : (
    <>
      <GenericBackHeader heading="Data Profile" addButtonInFlexCol={true}>
        <div>
          <Button
            id="add-data-profile"
            onClick={(e) => {
              e.preventDefault();
              setAddDataProfileModal({ visible: true, id: null });
            }}
            userEventName={"dataProfile-newProfile:modal-click"}
            buttonType="thin"
          >
            <div className="flex gap-x-2 items-center">
              <AddIcon size={16} />
              New Profile
            </div>
          </Button>
        </div>
      </GenericBackHeader>
      {viewSelectorComponent()}
      <div className="px-6 pt-4 sm:pt-6">
        <div className="py-4 px-6 bg-white rounded-xl">
          <div>
            <p className="text-md font-medium">Profile</p>
            <p className="text-sm">
              This page will allow you to define how you share the data among
              users based on your organization&apos;s role hierarchy.
            </p>
          </div>
          {/* <div className="flex gap-x-6 mt-4">
            <div className="text-sm flex items-center">
              <button className="pr-3 text-vryno-theme-light-blue">
                Expand All
              </button>
              <span className="text-vryno-theme-blue">|</span>
              <button className="pl-3 text-vryno-theme-light-blue">
                Collapse All
              </button>
            </div>
          </div> */}
          <DataProfileTree
            rootNode={rootNode}
            setAddDataProfileModal={(value: IAddEditProfileModal) =>
              setAddDataProfileModal(value)
            }
            setEditDataProfileModal={(value: IAddEditProfileModal) =>
              setEditDataProfileModal(value)
            }
          />
        </div>
      </div>
      {addDataProfileModal.visible && (
        <>
          <GenericFormModalContainer
            formHeading={"Add Profile"}
            onCancel={() =>
              setAddDataProfileModal({ visible: false, id: null })
            }
            onOutsideClick={() =>
              setAddDataProfileModal({ visible: false, id: null })
            }
          >
            <AddDataProfile
              parentId={addDataProfileModal.id}
              allParentIdOptions={allParentIdOptions}
              onCancel={() =>
                setAddDataProfileModal({ visible: false, id: null })
              }
              profileData={profileData}
              setProfileData={setProfileData}
              setRootNode={setRootNode}
              setAllParentIdOptions={setAllParentIdOptions}
              setProfileDataDict={setProfileDataDict}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() => setAddDataProfileModal({ visible: false, id: null })}
          />
        </>
      )}
      {editDataProfileModal.visible && (
        <>
          <GenericFormModalContainer
            formHeading={"Edit Profile"}
            onCancel={() =>
              setEditDataProfileModal({ visible: false, id: null })
            }
            onOutsideClick={() =>
              setEditDataProfileModal({ visible: false, id: null })
            }
          >
            <EditDataProfile
              id={editDataProfileModal.id}
              onCancel={() =>
                setEditDataProfileModal({ visible: false, id: null })
              }
              isRootNode={
                rootNode ? rootNode.data.id === editDataProfileModal.id : false
              }
              currentProfile={
                profileData.filter(
                  (data) => data.id == editDataProfileModal.id
                )[0]
              }
              parentIdOptions={allParentIdOptions?.filter(
                (data) => data.value !== editDataProfileModal.id
              )}
              profileData={profileData}
              setProfileData={setProfileData}
              setRootNode={setRootNode}
              setAllParentIdOptions={setAllParentIdOptions}
              setProfileDataDict={setProfileDataDict}
              profileDataDict={profileDataDict}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setEditDataProfileModal({ visible: false, id: null })
            }
          />
        </>
      )}
    </>
  );
};
