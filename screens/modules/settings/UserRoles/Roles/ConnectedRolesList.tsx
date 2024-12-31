import React from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { SettingsSideBar } from "../../SettingsSidebar";
import {
  AddRoleModal,
  IAddRoleModalVisible,
} from "./RoleCreationForm/AddRoleModal";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { GetRoleTableHeaders } from "./GetRoleTableHeaders";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import { IRole, SupportedApps } from "../../../../../models/shared";
import { useAccountsSaveMutation } from "../../../crm/shared/utils/operations";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { FormikValues } from "formik";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import SettingsIcon from "remixicon-react/EqualizerLineIcon";
import { PaginationFilterComponent } from "../../../../Shared/PaginationFilterCombined";

export const ConnectedRolesList = ({
  userRoles,
  savingProcess,
  menuItem,
  addRoleModalVisible,
  handleRoleCreation,
  setAddRoleModalVisible,
  setRoleList,
  itemsCount,
  currentPageNumber,
  onPageChange,
  setItemsCount,
}: {
  userRoles: IRole[];
  savingProcess: boolean;
  menuItem: string;
  addRoleModalVisible: IAddRoleModalVisible;
  handleRoleCreation: (values: FormikValues) => Promise<void>;
  setAddRoleModalVisible: (value: IAddRoleModalVisible) => void;
  setRoleList: React.Dispatch<React.SetStateAction<IRole[]>>;
  itemsCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  setItemsCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const [deleteModal, setDeleteModal] = React.useState({
    visible: false,
    id: "",
  });
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const editMenuArray = [
    {
      icon: (
        <SettingsIcon className={"mr-2 text-vryno-dropdown-icon"} size={16} />
      ),
      label: "Permissions",
      rowUrlGenerator: (data: IRole) => {
        return settingsUrlGenerator(SupportedApps.crm, menuItem, data.key, [
          "permissions",
          "crm",
        ]);
      },
    },
    {
      icon: (
        <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: "Delete",
      onClick: (data: IRole) => {
        if (data.key === "instance-admin" || data.key === "instance-user") {
          toast.error(`Cannot delete ${data.key}`);
          return;
        }
        setDeleteModal({ visible: true, id: data.id });
      },
    },
  ];

  const [deleteRoleMutation] = useAccountsSaveMutation<IRole>({
    onCompleted: (data) => {
      if (data.save.data && data.save.messageKey.includes("success")) {
        toast.success("Role successfully deleted.");
        setRoleList(userRoles.filter((val) => val.id !== data.save.data.id));
        setItemsCount(itemsCount - 1);
        resetDeleteModalProp();
        setDeleteLoading(false);
        return;
      }
      if (data.save.messageKey) {
        toast.error(data.save.message);
        resetDeleteModalProp();
        setDeleteLoading(false);
        return;
      }
      resetDeleteModalProp();
      setDeleteLoading(false);
      toast.error(t("common:unknown-message"));
    },
  });

  const resetDeleteModalProp = () => {
    setDeleteModal({
      visible: false,
      id: "",
    });
  };

  const deleteRole = () => {
    setDeleteLoading(true);
    try {
      deleteRoleMutation({
        variables: {
          id: deleteModal.id,
          modelName: "Role",
          saveInput: {
            recordStatus: "d",
          },
        },
      });
    } catch (error) {
      setDeleteLoading(false);
      console.error(error);
    }
  };

  const editAction = (data: IRole) => {
    setAddRoleModalVisible({ visible: true, data: data });
  };

  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  }, [userRoles]);
  let count = userRoles.length;

  return (
    <>
      <GenericBackHeader
        heading="Roles & Permissions"
        addButtonInFlexCol={true}
      >
        <div>
          <Button
            id="add-role"
            buttonType="thin"
            kind="primary"
            onClick={() =>
              setAddRoleModalVisible({ visible: true, data: null })
            }
            disabled={deleteLoading || savingProcess}
            userEventName="open-add-user-role-click"
          >
            <div className="flex gap-x-1">
              <CircleIcon size={20} />
              <p>Add Role</p>
            </div>
          </Button>
        </div>
      </GenericBackHeader>
      {!savingProcess ? (
        <>
          <div className="sm:hidden w-40 mt-4 mb-5">
            <SideDrawer
              sideMenuClass={sideMenuClass}
              setSideMenuClass={setSideMeuClass}
              buttonType={"thin"}
            >
              <SettingsSideBar />
            </SideDrawer>
          </div>
          <div className="px-6 sm:pt-6">
            {userRoles.length ? (
              <div className="mb-4">
                <PaginationFilterComponent
                  filterName={"roles"}
                  currentPageItemCount={userRoles.length}
                  currentPageNumber={currentPageNumber}
                  onPageChange={onPageChange}
                  setFilterValue={setFilterValue}
                  itemsCount={itemsCount}
                  classStyle={`hidden sm:flex sm:justify-between`}
                />
                <PaginationFilterComponent
                  filterName={"roles"}
                  currentPageItemCount={userRoles.length}
                  currentPageNumber={currentPageNumber}
                  onPageChange={onPageChange}
                  setFilterValue={setFilterValue}
                  itemsCount={itemsCount}
                  classStyle={`sm:hidden flex flex-col`}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="pt-4 px-4 bg-white rounded-xl">
              <div ref={heightRef}>
                <GenericList
                  data={userRoles}
                  tableHeaders={GetRoleTableHeaders(
                    menuItem,
                    editMenuArray,
                    editAction,
                    count,
                    userRoles
                  )}
                  listSelector={false}
                  rowUrlGenerator={(record: IRole) => {
                    return settingsUrlGenerator(
                      SupportedApps.crm,
                      menuItem,
                      record.key,
                      ["permissions", "crm", record.role]
                    );
                  }}
                  includeUrlWithRender={true}
                  filterValue={filterValue}
                />
              </div>
            </div>
          </div>
          <AddRoleModal
            {...{
              addRoleModalVisible,
              setAddRoleModalVisible,
              handleRoleCreation,
              savingProcess,
              userRoles,
            }}
          />
        </>
      ) : (
        <div className="px-6">
          <ItemsLoader currentView="List" loadingItemCount={2} />
        </div>
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={"delete_role_modal"}
            modalHeader={"Delete Role"}
            modalMessage={"Are you sure you want to delete role?"}
            leftButton={"Cancel"}
            rightButton={"Delete"}
            loading={deleteLoading}
            onCancel={() => resetDeleteModalProp()}
            onDelete={() => deleteRole()}
            onOutsideClick={() => resetDeleteModalProp()}
          />
          <Backdrop onClick={() => resetDeleteModalProp()} />
        </>
      )}
    </>
  );
};
