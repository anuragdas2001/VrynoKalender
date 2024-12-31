import React from "react";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import {
  BaseGenericObjectType,
  IRole,
  SupportedApps,
} from "../../../../../models/shared";
import { IUser, User } from "../../../../../models/Accounts";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import { useTranslation } from "next-i18next";
import { UserList } from "./UserList";
import ReloadIcon from "remixicon-react/RestartLineIcon";

export type UsersListProps = {
  menuItem: string;
  heightRef: React.RefObject<HTMLDivElement>;
  currentUser: User | null;
  userList: IUser[];
  rolesList: IRole[];
  setUserList: (items: IUser[]) => void;
  onPageChange: (pageNumber: number) => void;
  itemsCount: number;
  currentPageNumber: number;
  setItemsCount: React.Dispatch<React.SetStateAction<number>>;
};

export const UsersListContainer = ({
  menuItem,
  heightRef,
  currentUser,
  userList,
  rolesList,
  setUserList,
  onPageChange,
  itemsCount,
  currentPageNumber,
  setItemsCount,
}: UsersListProps) => {
  const { t } = useTranslation(["common"]);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({
    visible: false,
    id: null,
  });

  const [resetMfa, setResetMfa] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({
    visible: false,
    id: null,
  });

  const [serverDeleteData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.data) {
        setUserList(
          userList.filter(
            (val) => val.id !== responseOnCompletion?.save?.data.id
          )
        );
        toast.success("Item deleted successfully");
        setItemsCount(itemsCount - 1);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion?.save?.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const onUserUpdateHandler = (responseOnCompletion: any, message: string) => {
    if (responseOnCompletion?.save?.data) {
      setUserList(
        userList.map((val) => {
          if (val.id === responseOnCompletion?.save?.data.id) {
            return {
              ...val,
              isActive: responseOnCompletion?.save?.data.isActive,
            };
          } else {
            return val;
          }
        })
      );
      return toast.success(message);
    } else {
      return toast.error(responseOnCompletion?.save?.message);
    }
  };

  const [serverToggleActive] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      onUserUpdateHandler(responseOnCompletion, `Status updated successfully`);
    },
  });

  const [resetUserMfa] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      onUserUpdateHandler(responseOnCompletion, `MFA reset successfully`);
    },
  });

  const getEditMenuOptions = (record: IUser, user: User | null) => {
    const [resetMfaMenuOption, deleteUserMenuOption] = [
      {
        icon: (
          <ReloadIcon size={18} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: "Reset MFA",
        onClick: (data: IUser) => {
          setResetMfa({ visible: true, id: data.id });
        },
      },
      {
        icon: (
          <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: "Delete",
        onClick: (data: IUser) => {
          setDeleteModal({ visible: true, id: data.id });
        },
      },
    ];

    const hasRequiredRoles = (rolesList: IRole[], requiredRoles: string[]) => {
      return !!rolesList.find((role) => {
        return requiredRoles.indexOf(role.key) != -1;
      });
    };

    const mySelf = user?.id === record.id;
    if (mySelf && hasRequiredRoles(rolesList, ["instance-owner"]))
      return [resetMfaMenuOption];
    if (!mySelf && hasRequiredRoles(rolesList, ["instance-admin"]))
      return [resetMfaMenuOption, deleteUserMenuOption];
    return [deleteUserMenuOption];
  };

  const handleServerToggle = (record: BaseGenericObjectType) => {
    serverToggleActive({
      variables: {
        id: record.id,
        modelName: "User",
        saveInput: {
          isActive: !record.isActive,
        },
      },
    });
  };

  const handleMfaReset = (id: string) => {
    resetUserMfa({
      variables: {
        id: id,
        modelName: "User",
        saveInput: {
          mfaEnabled: false,
        },
      },
    });
  };

  return (
    <>
      {currentUser?.isInstanceAdmin && (
        <>
          <UserList
            userList={userList}
            menuItem={menuItem}
            rolesList={rolesList}
            handleServerToggle={handleServerToggle}
            getEditMenuOptions={getEditMenuOptions}
            heightRef={heightRef}
            onPageChange={onPageChange}
            itemsCount={itemsCount}
            currentPageNumber={currentPageNumber}
          />
          {deleteModal.visible && (
            <>
              <DeleteModal
                id={"delete_user_field"}
                modalHeader={`Delete User`}
                modalMessage={`Are you sure you want to delete this user?`}
                leftButton="Cancel"
                rightButton="Delete"
                loading={false}
                onCancel={() => setDeleteModal({ visible: false, id: null })}
                onDelete={() => {
                  serverDeleteData({
                    variables: {
                      id: deleteModal.id,
                      modelName: "User",
                      saveInput: {
                        recordStatus: "d",
                      },
                    },
                  });
                  setDeleteModal({ visible: false, id: null });
                }}
                onOutsideClick={() =>
                  setDeleteModal({ visible: false, id: null })
                }
              />
              <Backdrop
                onClick={() => setDeleteModal({ visible: false, id: null })}
              />
            </>
          )}
          {resetMfa.visible && (
            <>
              <DeleteModal
                id={"reset_mfa"}
                modalHeader={`Reset MFA`}
                modalMessage={`Are you sure you want to reset Multi Factor Authentication for this user?`}
                leftButton="Cancel"
                rightButton="Reset"
                loading={false}
                onCancel={() => setResetMfa({ visible: false, id: null })}
                onDelete={() => {
                  handleMfaReset(resetMfa.id ?? "");
                  setResetMfa({ visible: false, id: null });
                }}
                onOutsideClick={() => setResetMfa({ visible: false, id: null })}
              />
              <Backdrop
                onClick={() => setResetMfa({ visible: false, id: null })}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
